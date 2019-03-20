// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Application } from "../app";
import { container } from "../inversify.config";
import { ImageService } from "../services/image.service";
import { TimeScoreService } from "../services/timescore.service.manager";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("TimeScore Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const timeScoreService: TimeScoreService = container.get(TYPES.TimeScoreServiceManager);
        sandbox.on(timeScoreService, "changeHighScore", () => Promise.resolve(true));
        sandbox.on(timeScoreService, "resetBestScore", () => Promise.resolve(true));
        container.rebind(TYPES.IdentificationServiceManager).toConstantValue(timeScoreService);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Should return true from put", (done: Mocha.Done) => {
        supertest(app)
        .get("/api/identification")
        .query({
            gameRoomId: "test",
            point: JSON.stringify({"x": 0, "y": 0}),
        })
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });

    it("Should return mockedMessage from delete", (done: Mocha.Done) => {
        supertest(app)
        .delete("/api/identification")
        .query({
            gameRoomId: "test",
        })
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });

    it("Should return mockedMessage from post", (done: Mocha.Done) => {
        supertest(app)
        .post("/api/identification")
        .send({
            "gameRoomId": "test",
            "originalImageURL": "url1",
            "modifiedImageURL": "url2",
            "differenceImageURL": "url3",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });
});
