import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { BASE_ID, Message } from "../../../common/communication/message";
import { IGame } from "../../../common/models/game";
import { Application } from "../app";
import { container } from "../inversify.config";
import { FREEGAMES, SIMPLEGAMES } from "../mock-games";
import { PATHS } from "../path";
import { GameListService } from "../services/game-list.service";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

const mockedMessage: Message = {
    title: BASE_ID,
    body: "good job",
};

const mockedGame: IGame = {
    name: "testGame",
    imageURL: "",
    solo: {first: 1, second: 2, third: 3},
    multi: {first: 1, second: 2, third: 3},
};

describe("Game list controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    const baseURL: string = "/api/gamelist/";

    before(() => {
        container.snapshot();

        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        sandbox.on(imageService, "imageToString64", () => "");
        container.rebind(TYPES.ImageService).toConstantValue(imageService);

        const gameListService: GameListService = container.get<GameListService>(TYPES.GameListService);
        sandbox.on(gameListService, "addSimpleGame", () => Promise.resolve(mockedMessage));
        sandbox.on(gameListService, "addFreeGame", () => Promise.resolve(mockedGame));
        sandbox.on(gameListService, "getSimpleGame", () => Promise.resolve(SIMPLEGAMES));
        sandbox.on(gameListService, "getFreeGame", () => Promise.resolve(FREEGAMES));
        sandbox.on(gameListService, "deleteSimpleGame", () => Promise.resolve(mockedMessage));
        sandbox.on(gameListService, "deleteFreeGame", () => Promise.resolve(mockedMessage));
        container.rebind(TYPES.GameListService).toConstantValue(gameListService);

        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Post to simple should create a new game", (done: MochaDone) => {
        supertest(app)
        .post(baseURL + "simple")
        .field("name", "testGame")
        .attach("originalImage", PATHS.TEST_IMAGES_PATH + "image_test_1.bmp")
        .attach("modifiedImage", PATHS.TEST_IMAGES_PATH + "image_test_2.bmp")
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to simple should delete a game", (done: MochaDone) => {
        supertest(app)
        .delete(baseURL + "simple")
        .query({name: mockedGame.name})
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to free should delete a game", (done: MochaDone) => {
        supertest(app)
        .delete(baseURL + "free")
        .query({name: mockedGame.name})
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Get to simple should get SIMPLEGAMES", (done: MochaDone) => {
        supertest(app)
        .get(baseURL + "simple")
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(SIMPLEGAMES);
            done(error);
        });
    });

    it("Get to free should get FREEGAMES", (done: MochaDone) => {
        supertest(app)
        .get(baseURL + "free")
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(FREEGAMES);
            done(error);
        });
    });

    it("Post to free should create a new game", (done: MochaDone) => {
        supertest(app)
        .post(baseURL + "free")
        .field("name", "testGame")
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGame);
            done(error);
        });
    });
});
