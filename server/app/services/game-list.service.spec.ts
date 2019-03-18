import { fail } from "assert";
import Axios, { AxiosResponse } from "axios";
import chai = require("chai");
import spies = require("chai-spies");
import { Collection, Db, DeleteWriteOpResultObject, WriteOpResult } from "mongodb";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IFullGame, IGame, IGame3DForm, ISimpleForm } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { ITop3 } from "../../../common/models/top3";
import { container } from "../inversify.config";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { GameListService, MulterFile } from "./game-list.service";
import { ImageService } from "./image.service";

// tslint:disable-next-line:typedef
const mongoMock = require("mongo-mock");
mongoMock.max_delay = 0;
// tslint:disable-next-line:typedef
const mongoClient = mongoMock.MongoClient;

let mockSimpleCollection: Collection;
let mockFreeCollection: Collection;
const mockedNewImageMessage: Message = {
    title: BASE_ID, // Title is error_id to not add the game to the databse
    body: "newImageName",
};

const mockedErrorMessage: Message = {
    title: ERROR_ID,
    body: "error",
};
const mock3DGameForm: IGame3DForm = {
    name: "3dgame",
    objectType: "geometric",
    objectQty: 11,
    modifications: { add: true, delete: false, color: false },
};

const mockedGame: IGame = {
    id: "mockedID",
    name: "testGame",
    originalImage: "",
    solo: {first: {name: "allo", score: "asd"}, second: {name: "allo", score: "asd"}, third: {name: "allo", score: "asd"}} as ITop3,
    multi: {} as ITop3,
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    modifiedImage: " ",
    differenceImage: " ",
};

const mockedSimpleGame: ISimpleForm = {
    name: "testSimpleGame",
    originalImage: {} as File,
    modifiedImage: {} as File,
};

const mockedErrorGame: ISimpleForm = {
    name: "error",
    originalImage: {} as File,
    modifiedImage: {} as File,
};

const mockedMulterFile: MulterFile = {
    buffer: Buffer.alloc(0),
    fileName: "test",
};
const deleteWriteOPMock: DeleteWriteOpResultObject = {
    result: {
        ok: 1,
        n: 1,
    },
    // The number of documents deleted.
    deletedCount: 1,
};
const upperBound: number = 10;
const lowerBound: number = 5;

const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "123",
    originalScene: {  objects: [], backColor: -1, },
    modifiedScene: {  objects: [], backColor: -1, },
    solo: {} as ITop3,
    multi: {} as ITop3,
    differencesIndex: [],
};
const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);
describe("GameList service", () => {
    let service: GameListService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before((done: Mocha.Done) => {
        container.snapshot();
        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        const sockerController: SocketServerManager = container.get<SocketServerManager>(TYPES.SocketServerManager);
        container.rebind(TYPES.ImageService).toConstantValue(imageService);
        container.rebind(TYPES.SocketServerManager).toConstantValue(sockerController);
        container.rebind(TYPES.GameListService).to(GameListService);
        service = container.get<GameListService>(TYPES.GameListService);
        sandbox.on(service["socketController"], "emitEvent", () => null);
        mongoClient.connect("mongodb://localhost:27017/myproject", {}, (err: Error, db: Db) => {
            mockSimpleCollection = db.collection(service["SIMPLE_COLLECTION"]);
            mockFreeCollection = db.collection(GameListService["FREE_COLLECTION"]);
            service["_freeCollection"] = mockFreeCollection;
            service["_freeCollection"].insertOne(mockGame3D).catch();
            service["_simpleCollection"] = mockSimpleCollection;
            service["_simpleCollection"].insertOne(mockedFullGame).then((res: WriteOpResult) => {
                done();
            }).catch();
        });
    });
    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe("Getting games", () => {
        it("Getting simple games should return SIMPLEGAMES", async () => {
            service.getSimpleGames().then(
                (games: IGame[]) => {
                    expect(games[0]).to.eql(mockedFullGame.card);
                },
                () => fail(),
            );
        });

        it("Getting free games should return FREEGAMES", async () => {
            service.getFreeGames().then(
                (games: IGame3D[]) => {
                    expect(games[0].id).to.eql(mockGame3D.id);
                },
                () => fail(),
            );
        });

        it("Getting a simple game should return the game", async () => {
            const game: IFullGame = await service.getSimpleGame(mockedGame.id);

            // proprity added by the database
            delete game["_id"];
            expect(game).to.eql(mockedFullGame);
        });

        it("Getting a free game should return the game", async () => {
            const game: IGame3D = await service.getFreeGame(mockGame3D.id);

            // proprity added by the database
            delete game["_id"];
            expect(game).to.eql(mockGame3D);
        });
    });

    describe("Adding games", () => {
        it("Adding a free game should return the game", async () => {
            service.addFreeGame(mock3DGameForm).then(
                (message: Message) => {
                    expect(message.title).to.eql(" The 3D form sent was correct. ");
                },
                () => fail(),
            );
        });

        describe("Adding simple games", () => {

            afterEach(() => {
                sandbox.restore(Axios, "post");
            });

            it("Adding a simple game should return a valid message", async () => {
                sandbox.on(Axios, "post", () => {
                    return {
                        data: mockedNewImageMessage,
                    } as AxiosResponse;
                });
                service.addSimpleGame(mockedSimpleGame, mockedMulterFile, mockedMulterFile).then(
                    (message: Message) => {
                        expect(message).to.eql(mockedNewImageMessage);
                    },
                    () => fail(),
                );
            });

            it("Falling to add a simple game should return an error message", async () => {
                sandbox.on(Axios, "post", () => {
                    return {
                        data: mockedErrorMessage,
                    } as AxiosResponse;
                });
                service.addSimpleGame(mockedErrorGame, mockedMulterFile, mockedMulterFile).then(
                    (message: Message) => {
                        expect(message).to.eql(mockedErrorMessage);
                    },
                    () => fail(),
                );
            });
        });
    });

    describe("Deleting games", () => {
        describe("Deleting simple games", () => {
            it("Deleting a simple game that doesnt exist should return a relevant message", (done: Mocha.Done) => {
                service.deleteSimpleGame("simpleGame3").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu simpleGame3 n'existe pas!");
                        done();
                    }).catch();
            });

            it("Deleting a simple game should return a relevant message", async () => {
                sandbox.on(service["_simpleCollection"], "deleteOne", async () => {
                    return Promise.resolve(deleteWriteOPMock);
                });
                await service.deleteSimpleGame("testSimpleGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu testSimpleGame a été supprimé!");
                    }).catch();
            });

        });

        describe("Deleting free games", () => {

            it("Deleting a free game that doesnt exist should return a relevant message", (done: Mocha.Done) => {
                service.deleteFreeGame("freeGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu freeGame n'existe pas!");
                        done();
                    }).catch();
            });
            it("Deleting a free game that exist should return a relevant message", (done: Mocha.Done) => {
                sandbox.on(service["freeCollection"], "deleteOne", async () => {
                    return Promise.resolve(deleteWriteOPMock);
                });
                service.deleteFreeGame("testID").then(
                    (message: Message) => {
                        expect(message.body).to.equal(`Le jeu testID a été supprimé!`);
                        done();
                    }).catch();
            });

        });
        describe("Random generator", () => {
            it("The returned number should be below or equal the upper bound", () => {
                expect(service.randomNumberGenerator(0, upperBound) <= upperBound).to.be.equal(true);
            });
            it("The returned number should be above or euqalthe lower bound", () => {
                expect(service.randomNumberGenerator(lowerBound, lowerBound * 2) >= lowerBound).to.be.equal(true);
            });
        });
    });
});
