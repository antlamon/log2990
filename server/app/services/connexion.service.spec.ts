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
    describe("Test for the function isCorrectLength", () => {
        it("A empty string should return false", () => {
            expect(ConnexionService.isCorrectLength("")).to.equal(false);
        });
        it("A string under " + ConnexionService.MIN_USERNAME_LENGTH + " char should return false", () => {
            expect(ConnexionService.isCorrectLength("aa")).to.equal(false);
        });
        it("A string above " + ConnexionService.MAX_USERNAME_LENGTH + " char should return false", () => {
            expect(ConnexionService.isCorrectLength("aaaaaaaaaaa")).to.equal(false);
        });
        it("A string between " + ConnexionService.MIN_USERNAME_LENGTH + "and" + ConnexionService.MAX_USERNAME_LENGTH + " should return true", () => {
            expect(ConnexionService.isCorrectLength("aaaaa")).to.equal(true);
        });
    });

    describe("Test for the function containAlphaNumerics", () => {
        it("A string containing only regular char should return true", () => {
            expect(ConnexionService.containOnlyAlphaNumeric("abc123")).to.equal(true);
        });
        it("An empty string should return false", () => {
            expect(ConnexionService.containOnlyAlphaNumeric("")).to.equal(false);
        });
        it("A string containing @ should return false", () => {
            expect(ConnexionService.containOnlyAlphaNumeric("@")).to.equal(false);
        });
        it("A string containing both alpha numerics char and non alpha numerics char should return false", () => {
            expect(ConnexionService.containOnlyAlphaNumeric("abc123@")).to.equal(false);
        });
    });

    describe("Test for the function containAlphaNumerics", () => {
        let service: ConnexionService;
        let sandbox: ChaiSpies.Sandbox;
        const userManager: UsersManager = container.get(TYPES.UserManager);

        beforeEach(() => {
            service = new ConnexionService(userManager);
            sandbox = chai.spy.sandbox();
        });

        afterEach(() => {
            sandbox.restore();
        });

        it("A empty username should return an ERROR MESSAGE", () => {
            service.addName("", "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
            });
        });

        it("A username longer than: " + ConnexionService.MAX_USERNAME_LENGTH + " should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH + 1; ++i) {
                username += "a";
            }
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
            });
        });

        it("A username shorter than: " + ConnexionService.MIN_USERNAME_LENGTH + " should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH - 1; ++i) {
                username += "a";
            }
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
            });
        });

        it("A username containing non alphanumerics char should return an ERROR MESSAGE", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH; ++i) {
                username += "@";
            }
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
            });
        });

        it("A string containing both alpha numerics char and non alpha numerics char should return false", () => {
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MIN_USERNAME_LENGTH - 1; ++i) {
                username += "a";
            }
            username += "@";
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
            });
        });

        it("A username of regular length and contianing only alphanumerics char should return a BASIC MESSAGE", () => {
            sandbox.on(userManager, "userExist", () => false);
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH; ++i) {
                username += "a";
            }
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(BASE_ID);
            });
        });

        it("An already used username should return an ERROR MESSAGE", () => {
            sandbox.on(userManager, "userExist", () => true);
            let username: string = "";
            for (let i: number = 0; i < ConnexionService.MAX_USERNAME_LENGTH; ++i) {
                username += "a";
            }
            service.addName(username, "").then((message: Message) => {
                expect(message.title).to.equal(ERROR_ID);
                expect(message.body).to.equal("Name was already taken");
            });
        });
    });
});
