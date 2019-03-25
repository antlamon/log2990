// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { Identification3DServiceManager } from "../microservices/identification3D.service.manager";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

const mockedMessage: Message = {
    title: "ok",
    body: "Test",
};

describe("Identification 3D Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const identificationManager: Identification3DServiceManager = container.get(TYPES.Identification3DServiceManager);
        sandbox.on(identificationManager, "startNewService", () => mockedMessage);
        sandbox.on(identificationManager, "getDifference", () => mockedMessage);
        sandbox.on(identificationManager, "deleteService", () => mockedMessage);
        container.rebind(TYPES.Identification3DServiceManager).toConstantValue(identificationManager);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Should return mockedMessage from get", (done: Mocha.Done) => {
        supertest(app)
        .get("/api/identification3D")
        .query({
            gameRoomId: "test",
            name: "10",
        })
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });

    it("Should return mockedMessage from delete", (done: Mocha.Done) => {
        supertest(app)
        .delete("/api/identification3D")
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
        .post("/api/identification3D")
        .send({
            "gameRoomId": "test",
            "differences": "diff",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });
});
