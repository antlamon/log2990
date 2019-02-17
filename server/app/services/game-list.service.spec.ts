import { fail } from "assert";
import Axios, { AxiosResponse } from "axios";
import chai = require("chai");
import spies = require("chai-spies");
import { Collection, Db, WriteOpResult } from "mongodb";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IFullGame, IGame, ISimpleForm } from "../../../common/models/game";
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

let mockCollection: Collection;
const mockedNewImageMessage: Message = {
    title: BASE_ID, // Title is error_id to not add the game to the databse
    body: "newImageName",
};

const mockedErrorMessage: Message = {
    title: ERROR_ID,
    body: "error",
};

const mockedGame: IGame = {
    name: "testGame",
    imageURL: "",
    solo: { first: 1, second: 2, third: 3 },
    multi: { first: 1, second: 2, third: 3 },
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    imgDiffURL: " ",
    imgCmpURL: " ",
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
            mockCollection = db.collection(GameListService.SIMPLE_COLLECTION);
            service["simpleCollection"] = mockCollection;
            service["simpleCollection"].insert(mockedFullGame).then( (res: WriteOpResult) => {
                done();
            });
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
                (games: IGame[]) => {
                    expect(games).to.eql([]);
                },
                () => fail(),
            );
        });
    });

    describe("Adding games", () => {
        it("Adding a free game should return the game", async () => {
            service.addFreeGame(mockedGame).then(
                (message: IGame) => {
                    expect(message.name).to.eql(mockedGame.name);
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
            it("Deleting a simple game should return a relevant message",  async () => {
                service.deleteSimpleGame("testSimpleGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu testSimpleGame a été supprimé!");
                    });
            });

            it("Deleting a simple game that doesnt exist should return a relevant message",  (done: Mocha.Done) => {
                service.deleteSimpleGame("simpleGame3").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu simpleGame3 n'existe pas!");
                        done();
                    });
            });
        });

        describe("Deleting free games", () => {
            it("Deleting a free game should return a relevant message", async () => {
                const freeGame: IGame = {
                    name: "freeGame",
                    imageURL: "",
                    solo: { first: 1, second: 2, third: 3 },
                    multi: { first: 1, second: 2, third: 3 },
                };
                FREEGAMES.push(freeGame);
                service.deleteFreeGame("freeGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu freeGame a été supprimé");
                    },
                    () => fail(),
                );
            });

            it("Deleting a free game that doesnt exist should return a relevant message", (done: Mocha.Done) => {
                service.deleteFreeGame("freeGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu freeGame n'existe pas!");
                        done();
                    });
            });
        });
    });
});
