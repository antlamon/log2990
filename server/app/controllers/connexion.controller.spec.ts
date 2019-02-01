import { expect } from "chai";
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { ConnexionService } from "../services/connexion.service";
import { TYPES } from "../types";

const mockedAddName: Message = {
    title: "AddName",
    body: "The name test was added",
};

const mockedConnexionService: ConnexionService = {
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

    it("Should return added message", async() => {
        supertest(app)
        .get("/api/connexion")
        .expect("Content-Type", /json/)
        .expect(200)
        .then((response) => {
            expect(response.body).to.deep.equal(mockedAddName);
        });
    });
});
