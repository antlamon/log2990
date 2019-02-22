import Axios from "axios";
import * as chai from "chai";
import * as spies from "chai-spies";
import { BASE_ID, ERROR_ID, GameRoomUpdate, NewGameMessage } from "../../../common/communication/message";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { GameRoomService } from "./gameRoom.service";

chai.use(spies);
const expect: Chai.ExpectStatic = chai.expect;

describe("GameRoomService", () => {
    const service: GameRoomService = container.get(TYPES.GameRoomService);
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    afterEach(() => {
        sandbox.restore();
    });

    describe("Creating new game room", () => {
        it("Should return the gameRoomId on resolve", (done: Mocha.Done) => {
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: BASE_ID, body: "ok" }}));
            service.createNewGameRoom({ gameRoomId: "test", username: "user" } as NewGameMessage)
                .then(
                    (response: string) => {
                        expect(response).to.equal("ok");
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });

        it("Should return the rejection on reject", (done: Mocha.Done) => {
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: ERROR_ID }}));
            service.createNewGameRoom({ gameRoomId: "test", username: "user" } as NewGameMessage)
                .then(
                    (error: string) => {
                        done(error);
                    },
                    (rejection: string) => {
                        expect(rejection).to.equal("Couldn't create a new identification service");
                        done();
                    });
        });
    });

    describe("Checking Difference", () => {
        it("Should return the gameRoomId on resolve", (done: Mocha.Done) => {
            const mockedGameRoomUpdate: GameRoomUpdate = {
                username: "user",
                newImage: "ok",
                differencesFound: 1,
            };

            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: BASE_ID, body: "ok" }}));
            service.checkDifference("test", "user", {x: 0, y: 0})
                .then(
                    (response: GameRoomUpdate) => {
                        expect(response).to.eql(mockedGameRoomUpdate);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });

        it("Should return the gameRoomId on resolve", (done: Mocha.Done) => {
            const mockedGameRoomUpdate: GameRoomUpdate = {
                username: "newUser",
                newImage: "ok",
                differencesFound: 1,
            };

            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: BASE_ID, body: "ok" }}));
            service.checkDifference("test", "newUser", {x: 0, y: 0})
                .then(
                    (response: GameRoomUpdate) => {
                        expect(response).to.eql(mockedGameRoomUpdate);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });

        it("Should return the rejection on reject", (done: Mocha.Done) => {
            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: ERROR_ID, body: "error" }}));
            service.checkDifference("test", "user", { x: 0, y: 0 })
                .then(
                    (error: GameRoomUpdate) => {
                        done(error);
                    },
                    (rejection: string) => {
                        expect(rejection).to.equal("error");
                        done();
                    });
        });
    });
});
