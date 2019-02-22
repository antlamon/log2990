import { fail } from "assert";
import Axios, { AxiosResponse } from "axios";
import chai = require("chai");
import spies = require("chai-spies");
import { Collection, Db, DeleteWriteOpResultObject, WriteOpResult } from "mongodb";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IFullGame, IGame, IGame3DForm, ISimpleForm } from "../../../common/models/game";
import { Game3D } from "../../../common/models/game3D";
import { ITop3 } from "../../../common/models/top3";
import { container } from "../inversify.config";
import { FREEGAMES } from "../mock-games";
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
const mock3DGame: IGame3DForm = {
    name: "3dgame",
    objectType: "geometric",
    objectQty: 11,
    modifications: {add: true, delete: false, color: false},
};

const mockedGame: IGame = {
    id: "mockedID",
    name: "testGame",
    originalImageURL: "",
    solo: { } as ITop3,
    multi: { } as ITop3,
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    imgDiffURL: " ",
    imgCmpURL: " ",
};

const mockedSimpleGame: ISimpleForm = {
    id: 3948,
    name: "testSimpleGame",
    originalImage: {} as File,
    modifiedImage: {} as File,
};

const mockedErrorGame: ISimpleForm = {
    id: 0,
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
const mockGame3D: Game3D = {
    name: "mock3DName",
    id: "",
    originalScene: { modified: false, numObj: -1, objects: [], backColor: -1, },
    modifiedScene: { modified: true, numObj: -1, objects: [], backColor: -1, },
    solo: { } as ITop3,
    multi: { } as ITop3,
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
        sandbox.on(imageService, "imageToString64", () => "");
        sandbox.on(sockerController, "emitEvent", () => null);
        container.rebind(TYPES.ImageService).toConstantValue(imageService);
        container.rebind(TYPES.SocketServerManager).toConstantValue(sockerController);
        container.rebind(TYPES.GameListService).to(GameListService);
        service = container.get<GameListService>(TYPES.GameListService);
        // tslint:disable-next-line:typedef
        mongoClient.connect("mongodb://localhost:27017/myproject", {}, (err: Error, db: Db ) => {
            mockSimpleCollection = db.collection(GameListService.SIMPLE_COLLECTION);
            mockFreeCollection = db.collection(GameListService.FREE_COLLECTION);
            service["_freeCollection"] = mockFreeCollection;
            service["_freeCollection"].insertOne(mockGame3D);
            service["_simpleCollection"] = mockSimpleCollection;
            service["_simpleCollection"].insertOne(mockedFullGame).then( (res: WriteOpResult) => {
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
                (games: Game3D[]) => {
                    expect(games).to.eql(FREEGAMES);
                },
                () => fail(),
            );
        });
    });

    describe("Adding games", () => {
        it("Adding a free game should return the game", async () => {
            service.addFreeGame(mock3DGame).then(
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
    });
});
