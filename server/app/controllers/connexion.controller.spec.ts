import { expect } from "chai";
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { TYPES } from "../types";

const mockedAddName: Message = {
    title: "AddName",
    body: "The name test was added",
};

const mockedConnexionService: Object = {
    addName: () => Promise.resolve(mockedAddName),
};

describe("Connexion Controller", () => {
    let app: Express.Application;

    before(() => {
        container.snapshot();
        container.rebind(TYPES.ConnexionService).toConstantValue(mockedConnexionService);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        container.restore();
    });

    it("Should return added message", (done: MochaDone) => {
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
