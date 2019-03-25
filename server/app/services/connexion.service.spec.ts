import { fail } from "assert";
import chai = require("chai");
import spies = require("chai-spies");
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { ConnexionService } from "./connexion.service";
import { UsersManager } from "./users.service";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("Connexion service", () => {

    describe("Test for the function addName", () => {
        let service: ConnexionService;
        let sandbox: ChaiSpies.Sandbox;
        container.snapshot();
        const userManager: UsersManager = container.get(TYPES.UserManager);
        container.rebind(TYPES.UserManager).toConstantValue(userManager);

        beforeEach(() => {
            service = container.get(TYPES.ConnexionService);
            sandbox = chai.spy.sandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        after(() => {
            container.restore();
        });

        it("A empty username should return an ERROR MESSAGE", () => {
            service.addName("", "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                },
                () => fail(),
            );
        });

        it("A username longer than: " + ConnexionService.MAX_USERNAME_LENGTH + " should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH + 1; ++i) {
                username += "a";
            }
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                },
                () => fail(),
            );
        });

        it("A username shorter than: " + ConnexionService.MIN_USERNAME_LENGTH + " should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH - 1; ++i) {
                username += "a";
            }
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                },
                () => fail(),
            );
        });

        it("A username containing non alphanumerics char should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH; ++i) {
                username += "@";
            }
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                },
                () => fail(),
            );
        });

        it("A string containing both alpha numerics char and non alpha numerics char should return false", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH - 1; ++i) {
                username += "a";
            }
            username += "@";
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                },
                () => fail(),
            );
        });

        it("A username of regular length and contianing only alphanumerics char should return a BASIC MESSAGE", () => {
            sandbox.on(userManager, "userExist", () => false);
            sandbox.on(service["socket"], "emitEvent", () => null);
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH; ++i) {
                username += "a";
            }
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(BASE_ID);
                },
                () => fail(),
            );
        });

        it("An already used username should return an ERROR MESSAGE", () => {
            sandbox.on(userManager, "userExist", () => true);
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH; ++i) {
                username += "a";
            }
            service.addName(username, "").then(
                (message: Message) => {
                    expect(message.title).to.equal(ERROR_ID);
                    expect(message.body).to.equal("Nom déjà choisi");
                },
                () => fail(),
            );
        });
    });
});
