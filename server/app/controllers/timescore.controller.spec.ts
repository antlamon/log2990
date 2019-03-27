// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { ERROR_ID } from "../../../common/communication/message";
import { INVALID_ID_ERROR } from "../../../common/models/errors";
import { Application } from "../app";
import { container } from "../inversify.config";
import { TimeScoreService } from "../microservices/timescore.service";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("TimeScore Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    let timeScoreService: TimeScoreService;
    before(() => {
        container.snapshot();
        timeScoreService = container.get(TYPES.TimeScoreService);
        container.rebind(TYPES.TimeScoreService).toConstantValue(timeScoreService);
        app = container.get<Application>(TYPES.Application).app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Should return true from put", (done: Mocha.Done) => {
        sandbox.on(timeScoreService, "changeHighScore", async () => Promise.resolve(1));
        supertest(app)
        .put("/api/timescore")
        .send({
            username: "user",
            gameType: "simple-games",
            gameMode: "solo",
            id: "id",
            nbMinutes: 0,
            nbSeconds: 30,
        })
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body.body).to.eql(1);
            done(error);
        });
    });

    it("Should complete from get to reset", (done: Mocha.Done) => {
        sandbox.on(timeScoreService, "resetBestScore", async () => Promise.resolve());
        supertest(app)
        .get("/api/timescore/reset")
        .query({
            gameType: "test",
            id: "id",
        })
        .expect(200)
        .end((error: Error) => {
            done(error);
        });
    });

    it("Should return 422 from put", (done: Mocha.Done) => {
        sandbox.on(timeScoreService, "changeHighScore", async () => Promise.reject(new INVALID_ID_ERROR("oups")));
        supertest(app)
        .put("/api/timescore")
        .send({
            username: "user",
            gameType: "simple-games",
            gameMode: "solo",
            id: "id",
            nbMinutes: 0,
            nbSeconds: 30,
        })
        .expect(422)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body.title).to.eql(ERROR_ID);
            done(error);
        });
    });

    it("Should return 422 from get to reset", (done: Mocha.Done) => {
        sandbox.on(timeScoreService, "resetBestScore", async () => Promise.reject(new INVALID_ID_ERROR("oups")));
        supertest(app)
        .get("/api/timescore/reset")
        .query({
            gameType: "test",
            id: "id",
        })
        .expect(422)
        .end((error: Error) => {
            done(error);
        });
    });
});
