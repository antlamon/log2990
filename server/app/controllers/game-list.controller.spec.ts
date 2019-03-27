import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { BASE_ID, Message } from "../../../common/communication/message";
import { HTTP_ERROR } from "../../../common/models/errors";
import { IGame } from "../../../common/models/game";
import { Application } from "../app";
import { container } from "../inversify.config";
import { ImageService } from "../microservices/image.service";
import { FREEGAMES } from "../mock-games";
import { GameListService } from "../services/game-list.service";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);
const HTTP_OK: number = 200;
const HTTP_INVALID_PARAM: number = 422;
const TEST_IMAGES_PATH: string = "./app/documents/test-images/";
const mockedMessage: Message = {
    title: BASE_ID,
    body: "good job",
};

const mockedGame: IGame = {
    id: "idmockgenerate",
    name: "testGame",
    originalImage: "",
    solo: [],
    multi: [],
};

describe("Game list controller", () => {
    let app: Express.Application;
    let gameListService: GameListService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    const baseURL: string = "/api/gamelist/";

    before(() => {
        container.snapshot();

        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        sandbox.on(imageService, "imageToString64", () => "");
        container.rebind(TYPES.ImageService).toConstantValue(imageService);

        gameListService = container.get<GameListService>(TYPES.GameListService);
        container.rebind(TYPES.GameListService).toConstantValue(gameListService);

        app = container.get<Application>(TYPES.Application).app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        container.restore();
    });

    it("Post to simple should create a new game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "addSimpleGame", async() => Promise.resolve(mockedMessage));
        supertest(app)
        .post(baseURL + "simple")
        .field("name", "testGame")
        .attach("originalImage", TEST_IMAGES_PATH + "image_test_1.bmp")
        .attach("modifiedImage", TEST_IMAGES_PATH + "image_test_2.bmp")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Post to simple should create a new game from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "addSimpleGame", async() => Promise.reject(mockedMessage));
        supertest(app)
        .post(baseURL + "simple")
        .field("name", "testGame")
        .attach("originalImage", TEST_IMAGES_PATH + "image_test_1.bmp")
        .attach("modifiedImage", TEST_IMAGES_PATH + "image_test_2.bmp")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to simple should delete a game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "deleteSimpleGame", async() => Promise.resolve(mockedMessage));
        supertest(app)
        .delete(baseURL + "simple")
        .query({name: mockedGame.name})
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to simple should delete a game from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "deleteSimpleGame", async() => Promise.reject(mockedMessage));
        supertest(app)
        .delete(baseURL + "simple")
        .query({name: mockedGame.name})
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to free should delete a game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "deleteFreeGame", async() => Promise.resolve(mockedMessage));
        supertest(app)
        .delete(baseURL + "free")
        .query({name: mockedGame.name})
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Delete to free should delete a game from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "deleteFreeGame", async() => Promise.reject(mockedMessage));
        supertest(app)
        .delete(baseURL + "free")
        .query({name: mockedGame.name})
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedMessage);
            done(error);
        });
    });

    it("Get to simple should get SIMPLEGAMES", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getSimpleGames", async() => Promise.resolve([]));
        supertest(app)
        .get(baseURL + "simple")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql([]);
            done(error);
        });
    });

    it("Get to simple should get SIMPLEGAMES from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getSimpleGames", async() => Promise.reject([]));
        supertest(app)
        .get(baseURL + "simple")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql([]);
            done(error);
        });
    });

    it("Get to free should get FREEGAMES", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getFreeGames", async() => Promise.resolve(FREEGAMES));
        supertest(app)
        .get(baseURL + "free")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(FREEGAMES);
            done(error);
        });
    });

    it("Get to free should get FREEGAMES from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getFreeGames", async() => Promise.reject(FREEGAMES));
        supertest(app)
        .get(baseURL + "free")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(FREEGAMES);
            done(error);
        });
    });

    it("Post to free should create a new game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "addFreeGame", async() => Promise.resolve(mockedGame));
        supertest(app)
        .post(baseURL + "free")
        .field("name", "testGame")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGame);
            done(error);
        });
    });

    it("Post to free should create a new game from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "addFreeGame", async() => Promise.reject(mockedGame));
        supertest(app)
        .post(baseURL + "free")
        .field("name", "testGame")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGame);
            done(error);
        });
    });

    it("Get to onesimple should get a simple game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getSimpleGame", async() => Promise.resolve(mockedGame));
        supertest(app)
        .get(baseURL + "onesimple")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGame);
            done(error);
        });
    });

    it("Get to onesimple should get an error from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getSimpleGame", async() => Promise.reject("error"));
        supertest(app)
        .get(baseURL + "onesimple")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql("error");
            done(error);
        });
    });

    it("Get to onefree should get a free game", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getFreeGame", async() => Promise.resolve(mockedGame));
        supertest(app)
        .get(baseURL + "onefree")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGame);
            done(error);
        });
    });

    it("Get to onefree should get an error from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "getFreeGame", async() => Promise.reject("error"));
        supertest(app)
        .get(baseURL + "onefree")
        .expect(HTTP_OK)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql("error");
            done(error);
        });
    });

    it("Get to reset should complete", (done: Mocha.Done) => {
        sandbox.on(gameListService, "resetTimeScore", async() => Promise.resolve());
        supertest(app)
        .get(baseURL + "reset")
        .expect(HTTP_OK)
        .end((error: Error) => {
            done(error);
        });
    });

    it("Get to reset should get an error from promise rejection", (done: Mocha.Done) => {
        sandbox.on(gameListService, "resetTimeScore", async() => Promise.reject(new HTTP_ERROR("error")));
        supertest(app)
        .get(baseURL + "reset")
        .expect(HTTP_INVALID_PARAM)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body.title).to.eql("error");
            done(error);
        });
    });
});
