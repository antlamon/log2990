// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Application } from "../app";
import { container } from "../inversify.config";
import { TimeScoreService } from "../services/timescore.service.manager";
import { TYPES } from "../types";

chai.use(spies);

describe("TimeScore Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const timeScoreService: TimeScoreService = container.get(TYPES.TimeScoreServiceManager);
        sandbox.on(timeScoreService, "changeHighScore", () => true);
        sandbox.on(timeScoreService, "resetBestScore", () => true);
        container.rebind(TYPES.IdentificationServiceManager).toConstantValue(timeScoreService);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Should return true from put", (done: Mocha.Done) => {
        supertest(app)
        .put("/api/timescore")
        .query({
            username: "user",
            gameType: "solo",
            gameMode: "solo",
            id: "id",
            nbMinutes: 0,
            nbSeconds: 30,
        })
        .expect(200)
        .end((error: Error) => {
            done(error);
        });
    });

    it("Should return true from get to reset", (done: Mocha.Done) => {
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
});
