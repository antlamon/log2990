// tslint:disable:no-magic-numbers
import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { TYPES } from "../types";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

const mockedAddName: Message = {
    title: "AddName",
    body: "The name test was added",
};

const mockedConnexionService: Object = {
    addName: async () => null,
};

describe("Connexion Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        container.rebind(TYPES.ConnexionService).toConstantValue(mockedConnexionService);
        app = container.get<Application>(TYPES.Application).app;
    });

    afterEach(() => {
        sandbox.restore();
    });

    after(() => {
        container.restore();
    });

    it("Should return added message", (done: Mocha.Done) => {
        sandbox.on(mockedConnexionService, "addName", async () => Promise.resolve(mockedAddName));
        supertest(app)
        .get("/api/connexion")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedAddName, "Add name didnt work");
            done(error);
        });
    });

    it("Should return added message from promise rejection", (done: Mocha.Done) => {
        sandbox.on(mockedConnexionService, "addName", async () => Promise.reject(mockedAddName));
        supertest(app)
        .get("/api/connexion")
        .expect("Content-Type", /json/)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.deep.equal(mockedAddName, "Add name didnt work");
            done(error);
        });
    });
});
