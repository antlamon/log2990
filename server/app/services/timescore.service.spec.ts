import chai = require("chai");
import spies = require("chai-spies");
import { Collection, Db, WriteOpResult } from "mongodb";
import { IFullGame, IGame } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { ITop3 } from "../../../common/models/top3";
import { container } from "../inversify.config";
import { TimeScoreService } from "../services/timescore.service";
import { TYPES } from "../types";
// tslint:disable-next-line:typedef
const mongoMock = require("mongo-mock");
mongoMock.max_delay = 0;
// tslint:disable-next-line:typedef
const mongoClient = mongoMock.MongoClient;

let mockSimpleCollection: Collection;
let mockFreeCollection: Collection;
const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);
const mockedGame: IGame = {
    id: "mockedID",
    name: "testGame",
    originalImage: "",
    solo: {first: {name: "one", score: "10:10"}, second: {name: "two", score: "10:11"}, third: {name: "three", score: "10:12"}} as ITop3,
    multi: {first: {name: "one", score: "10:10"}, second: {name: "two", score: "10:11"}, third: {name: "three", score: "10:12"}} as ITop3,
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    modifiedImage: " ",
    differenceImage: " ",
};
const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "123",
    originalScene: { modified: false, numObj: -1, objects: [], backColor: -1, },
    modifiedScene: { modified: true, numObj: -1, objects: [], backColor: -1, },
    solo: {first: {name: "one", score: "10:10"}, second: {name: "two", score: "10:11"}, third: {name: "three", score: "10:12"}} as ITop3,
    multi: {first: {name: "one", score: "10:10"}, second: {name: "two", score: "10:11"}, third: {name: "three", score: "10:12"}} as ITop3,
    differencesIndex: [],
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

    describe("Test for the function resetBestScore", () => {
        it("Check if game score for solo and multi have changed name for a simple game reset and function returned true", async () => {
            expect(await service.resetBestScore(service["SIMPLE_COLLECTION"], "mockedID")).to.equal(true);
            await mockSimpleCollection.findOne({"card.id": mockedFullGame.card.id}).then((game: IFullGame) => {
                expect(game.card.solo.first.name).to.equal("GoodComputer");
                expect(game.card.solo.second.name).to.equal("MediumComputer");
                expect(game.card.solo.third.name).to.equal("BadComputer");
                expect(game.card.multi.first.name).to.equal("GoodComputer");
                expect(game.card.multi.second.name).to.equal("MediumComputer");
                expect(game.card.multi.third.name).to.equal("BadComputer");
            });
        });
        it("Check if game score for solo and multi have changed name for a free game reset and function returned true", async () => {
            expect(await service.resetBestScore(service["FREE_COLLECTION"], mockGame3D.id)).to.equal(true);
            await mockFreeCollection.findOne({id: mockGame3D.id}).then((game: IGame3D) => {
                expect(game.solo.first.name).to.equal("GoodComputer");
                expect(game.solo.second.name).to.equal("MediumComputer");
                expect(game.solo.third.name).to.equal("BadComputer");
                expect(game.multi.first.name).to.equal("GoodComputer");
                expect(game.multi.second.name).to.equal("MediumComputer");
                expect(game.multi.third.name).to.equal("BadComputer");
            });
        });
    });

});