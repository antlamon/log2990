import chai = require("chai");
import spies = require("chai-spies");
import { Collection, Db, WriteOpResult } from "mongodb";
import { IFullGame, IGame } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { container } from "../inversify.config";
import { TimeScoreService } from "./timescore.service";
import { TYPES } from "../types";
// tslint:disable-next-line:typedef
const mongoMock = require("mongo-mock");
mongoMock.max_delay = 0;
// tslint:disable-next-line:typedef
const mongoClient = mongoMock.MongoClient;
const FORMAT_SCORE_LENGHT: number = 5;

let mockSimpleCollection: Collection;
let mockFreeCollection: Collection;
const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);
const mockedGame: IGame = {
    id: "mockedID",
    name: "testGame",
    originalImage: "",
    solo: [{name: "one1", score: "20:10"}, {name: "two", score: "20:11"}, {name: "three", score: "20:12"}],
    multi: [{name: "one", score: "20:10"}, {name: "two", score: "20:11"}, {name: "three", score: "20:12"}],
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    modifiedImage: " ",
    differenceImage: " ",
};
const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "123",
    originalScene: [],
    solo: [{name: "one", score: "20:10"}, {name: "two", score: "20:11"}, {name: "three", score: "20:12"}],
    multi: [{name: "one", score: "20:10"}, {name: "two", score: "20:11"}, {name: "three", score: "20:12"}],
    differences: [],
    isThematic: false,
    backColor: 0,
};

describe("Test for TimeScoreService", () => {
    let service: TimeScoreService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    before((done: Mocha.Done) => {
        container.snapshot();
        service = container.get<TimeScoreService>(TYPES.TimeScoreService);
        mongoClient.connect("mongodb://localhost:27017/myproject2", {}, (err: Error, db: Db) => {
            mockSimpleCollection = db.collection(service["SIMPLE_COLLECTION"]);
            mockFreeCollection = db.collection(service["FREE_COLLECTION"]);
            service["_freeCollection"] = mockFreeCollection;
            service["_freeCollection"].insertOne(mockGame3D).catch();
            service["_simpleCollection"] = mockSimpleCollection;
            service["_simpleCollection"].insertOne(mockedFullGame).then((res: WriteOpResult) => {
                done();
            }).catch();
        });

    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    describe("Test for the function changeHighScore", () => {
        const mockUsername: string = "mockUsername";

        it("Sending a invalid gameType should throw", (done: Mocha.Done) => {
            service.changeHighScore(mockUsername, "invalid", "solo", "mockID", FORMAT_SCORE_LENGHT, 0)
            .catch((error: Error) => {
                expect(error.message).to.eql(TimeScoreService.INVALID_GAMETYPE_EXCEPTION);
                done();
            });
        });

        it("Sending a invalid gameMode should throw for free games", (done: Mocha.Done) => {
            service.changeHighScore(mockUsername, service["FREE_COLLECTION"], "Invalidsolo", "123", FORMAT_SCORE_LENGHT, 0)
            .catch((error: Error) => {
                expect(error.message).to.eql(TimeScoreService.INVALID_GAMEMODE_EXCEPTION);
                done();
            });
        });

        it("Sending a invalid gameMode should throw for simple games", (done: Mocha.Done) => {
            service.changeHighScore(mockUsername, service["SIMPLE_COLLECTION"], "Invalidsolo", "mockedID", FORMAT_SCORE_LENGHT, 0)
            .catch((error: Error) => {
                expect(error.message).to.eql(TimeScoreService.INVALID_GAMEMODE_EXCEPTION);
                done();
            });
        });

        it("Sending a time greater than the ones in the database should return false", async () => {
            const tooMuchMin: number = 100;
            expect(await service.changeHighScore(
                mockUsername, service["FREE_COLLECTION"], "solo", mockGame3D.id, tooMuchMin, 0)).to.equal(false);
        });

        it("Sending a time equal to the third best time should return false", async () => {
            const thirdTimeAS: string[] = mockedFullGame.card.multi[2].score.split(":");
            expect(await service.changeHighScore(
                mockUsername, service["SIMPLE_COLLECTION"], "multi", mockedFullGame.card.id,
                +thirdTimeAS[0], +thirdTimeAS[1])).to.equal(false);
        });

        it("Sending a time equal to the second best time should modify the third best time", async () => {
            const secondTimeAS: string[] = mockedFullGame.card.solo[1].score.split(":");
            expect(await service.changeHighScore(
                mockUsername, service["SIMPLE_COLLECTION"], "solo", mockedFullGame.card.id,
                +secondTimeAS[0], +secondTimeAS[1])).to.equal(true);
            await mockSimpleCollection.findOne({"card.id": mockedFullGame.card.id}).then((game: IFullGame) => {
                        expect(game.card.solo[2].name).to.equal(mockUsername);
                        expect(game.card.solo[2].score).to.equal(game.card.solo[1].score);
                    });
        });

        it("Sending a 00:00 should update the first score", async () => {
            expect(await service.changeHighScore(
                mockUsername, service["FREE_COLLECTION"], "multi", mockGame3D.id,
                0, 0)).to.eql(true);
            await mockFreeCollection.findOne({"id": mockGame3D.id}).then((game: IGame3D) => {
                        expect(game.multi[0].name).to.equal(mockUsername);
                        expect(game.multi[0].score).to.equal("00:00");
                    });
        });
    });

    describe("Test for the function resetBestScore", () => {
        it("Check if game score for solo and multi have changed name for a simple game reset", async () => {
            await service.resetBestScore(service["SIMPLE_COLLECTION"], "mockedID");
            await mockSimpleCollection.findOne({"card.id": mockedFullGame.card.id}).then((game: IFullGame) => {
                expect(game.card.solo[0].name).to.equal("GoodComputer");
                expect(game.card.solo[1].name).to.equal("MediumComputer");
                expect(game.card.solo[2].name).to.equal("BadComputer");
                expect(game.card.multi[0].name).to.equal("GoodComputer");
                expect(game.card.multi[1].name).to.equal("MediumComputer");
                expect(game.card.multi[2].name).to.equal("BadComputer");
            });
        });

        it("Check if game score for solo and multi have changed name for a free game reset", async () => {
            await service.resetBestScore(service["FREE_COLLECTION"], mockGame3D.id);
            await mockFreeCollection.findOne({id: mockGame3D.id}).then((game: IGame3D) => {
                expect(game.solo[0].name).to.equal("GoodComputer");
                expect(game.solo[1].name).to.equal("MediumComputer");
                expect(game.solo[2].name).to.equal("BadComputer");
                expect(game.multi[0].name).to.equal("GoodComputer");
                expect(game.multi[1].name).to.equal("MediumComputer");
                expect(game.multi[2].name).to.equal("BadComputer");
            });
        });

        it("Check if game score are in order and follow the format 00:00", async () => {
            await service.resetBestScore(service["FREE_COLLECTION"], mockGame3D.id);
            await mockFreeCollection.findOne({id: mockGame3D.id}).then((game: IGame3D) => {
                expect(game.solo[0].score.split(":").length).to.equal(2);
                expect(game.solo[1].score.length).to.equal(FORMAT_SCORE_LENGHT);
                expect(+game.solo[2].score.split(":")[0]).to.not.equal(NaN);
                expect(+game.solo[2].score.split(":")[1]).to.not.equal(NaN);
                const firstScore: string[] = game.solo[0].score.split(":");
                const secondScore: string[] = game.solo[1].score.split(":");
                const thirdScore: string[] = game.solo[2].score.split(":");
                expect((TimeScoreService.MAX_NB_SECONDS * (+firstScore[0] - +secondScore[0]) +
                +firstScore[1] - +secondScore[1]) <= 0).to.be.equal(true);
                expect((TimeScoreService.MAX_NB_SECONDS * (+secondScore[0] - +thirdScore[0]) +
                +secondScore[1] - +thirdScore[1]) <= 0).to.be.equal(true);
            });
        });

        it("Sending a invalid gameType should return false", (done: Mocha.Done) => {
            service.resetBestScore("invalid", "mockID")
            .catch((error: Error) => {
                expect(error.message).to.eql(TimeScoreService.INVALID_GAMETYPE_EXCEPTION);
                done();
            });
        });
    });

});
