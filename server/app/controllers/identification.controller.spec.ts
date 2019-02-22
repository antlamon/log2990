// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { IdentificationServiceManager } from "../services/identification.service.manager";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

const mockedMessage: Message = {
    title: "ok",
    body: "Test",
};

describe("Identification Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const identificationManager: IdentificationServiceManager = container.get(TYPES.IdentificationServiceManager);
        sandbox.on(identificationManager, "startNewService", () => mockedMessage);
        sandbox.on(identificationManager, "getDifference", () => mockedMessage);
        sandbox.on(identificationManager, "deleteService", () => mockedMessage);
        container.rebind(TYPES.IdentificationServiceManager).toConstantValue(identificationManager);
        const service: ImageService = container.get<ImageService>(TYPES.ImageService);
        sandbox.on(service, "imageToString64", () => "");
        container.rebind(TYPES.ImageService).toConstantValue(service);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        sandbox.restore();
        container.restore();
    });

    it("Should return mockedMessage from get", (done: Mocha.Done) => {
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
            "originalImagePath": "path1",
            "modifiedImagePath": "path2",
            "differenceImagePath": "path3",
        })
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedMessage);
            done(error);
        });
    });
});
