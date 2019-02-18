import { fail } from "assert";
import Axios, { AxiosResponse } from "axios";
import chai = require("chai");
import spies = require("chai-spies");
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IGame, ISimpleForm } from "../../../common/models/game";
import { Game3D } from "../../../common/models/game3D";
import { container } from "../inversify.config";
import { FREEGAMES, SIMPLEGAMES } from "../mock-games";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { GameListService, MulterFile } from "./game-list.service";
import { ImageService } from "./image.service";

const mockedNewImageMessage: Message = {
    title: BASE_ID,
    body: "newImageName",
};

const mockedErrorMessage: Message = {
    title: ERROR_ID,
    body: "error",
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

    before(() => {
        container.snapshot();
        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        const sockerController: SocketServerManager = container.get<SocketServerManager>(TYPES.SocketServerManager);
        sandbox.on(imageService, "imageToString64", () => "");
        sandbox.on(sockerController, "emitEvent", () => null);
        container.rebind(TYPES.ImageService).toConstantValue(imageService);
        container.rebind(TYPES.SocketServerManager).toConstantValue(sockerController);
        service = container.get<GameListService>(TYPES.GameListService);
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe("Getting games", () => {
        it("Getting simple games should return SIMPLEGAMES", async () => {
            service.getSimpleGames().then(
                (games: IGame[]) => {
                    expect(games).to.eql(SIMPLEGAMES);
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

        describe("Adding simple games", () => {

            afterEach(() => {
                sandbox.restore(Axios, "post");
            });

            it("Adding a simple game should return the game", async () => {
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
            it("Deleting a simple game should return a relevant message", async () => {
                const simpleGame: IGame = {
                    name: "simpleGame",
                    imageURL: "",
                    solo: { first: 1, second: 2, third: 3 },
                    multi: { first: 1, second: 2, third: 3 },
                };
                SIMPLEGAMES.push(simpleGame);
                service.deleteSimpleGame("simpleGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu simpleGame a été supprimé");
                    },
                    () => fail(),
                );
            });

            it("Deleting a simple game that doesnt exist should return a relevant message", async () => {
                service.deleteSimpleGame("simpleGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu simpleGame n'existe pas!");
                    },
                    () => fail(),
                );
            });
        });

        describe("Deleting free games", () => {
            /*it("Deleting a free game should return a relevant message", async () => {
                const freeGame: IGame = {
                    name: "freeGame",
                    imageURL: "",
                    solo: { first: 1, second: 2, third: 3 },
                    multi: { first: 1, second: 2, third: 3 },
                };
                FREEGAMES.push(simpl);
                service.deleteFreeGame("freeGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu freeGame a été supprimé");
                    },
                    () => fail(),
                );
            });*/

            it("Deleting a free game that doesnt exist should return a relevant message", async () => {
                service.deleteFreeGame("freeGame").then(
                    (message: Message) => {
                        expect(message.body).to.equal("Le jeu freeGame n'existe pas!");
                    },
                    () => fail(),
                );
            });
        });
    });
});
