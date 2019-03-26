import Axios from "axios";
import * as chai from "chai";
import * as spies from "chai-spies";
import { BASE_ID, ERROR_ID, Game3DRoomUpdate,
    GameRoomUpdate, NewGame3DMessage, NewGameMessage, EndGameMessage, ScoreUpdate, NewScoreUpdate } from "../../../../common/communication/message";
import { ADD_TYPE } from "../../../../common/models/game3D";
import { container } from "../../inversify.config";
import { TYPES } from "../../types";
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
        it("Should return the gameRoomId on resolve for 3D", (done: Mocha.Done) => {
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: BASE_ID, body: "ok" }}));
            service.createNewGameRoom({ gameRoomId: "test3D", username: "user", is3D: true } as NewGame3DMessage)
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
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: ERROR_ID, body: "error" }}));
            service.createNewGameRoom({ gameRoomId: "test", username: "user" } as NewGameMessage)
                .then(
                    (error: string) => {
                        done(error);
                    },
                    (rejection: Error) => {
                        expect(rejection.message).to.equal("error");
                        done();
                    });
        });
        it("Should return the rejection on reject for 3D", (done: Mocha.Done) => {
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: ERROR_ID, body: "error" }}));
            service.createNewGameRoom({ gameRoomId: "test3D", username: "user", is3D: true } as NewGame3DMessage)
                .then(
                    (error: string) => {
                        done(error);
                    },
                    (rejection: Error) => {
                        expect(rejection.message).to.equal("error");
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
                isGameOver: false,
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
                isGameOver: false,
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
                    (update: GameRoomUpdate) => {
                        expect(update.differencesFound).to.equal(-1);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });
    });
    describe("Checking Difference 3D", () => {
        it("Should return the gameRoomId on resolve", (done: Mocha.Done) => {
            const mockedGameRoomUpdate: Game3DRoomUpdate = {
                username: "user",
                objName: "1",
                diffType: ADD_TYPE,
                differencesFound: 1,
                isGameOver: false,
            };

            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: BASE_ID, body: {name: "1", type: ADD_TYPE} }}));
            service.checkDifference3D("test3D", "user", "1")
                .then(
                    (response: Game3DRoomUpdate) => {
                        expect(response).to.eql(mockedGameRoomUpdate);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });

        it("Should return the gameRoomId on resolve", (done: Mocha.Done) => {
            const mockedGameRoomUpdate: Game3DRoomUpdate = {
                username: "newUser",
                objName: "1",
                diffType: ADD_TYPE,
                differencesFound: 1,
                isGameOver: false,
            };

            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: BASE_ID, body: {name: "1", type: ADD_TYPE} }}));
            service.checkDifference3D("test3D", "newUser", "1")
                .then(
                    (response: Game3DRoomUpdate) => {
                        expect(response).to.eql(mockedGameRoomUpdate);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });

        it("Should return the rejection on reject", (done: Mocha.Done) => {
            sandbox.on(Axios, "get", async () => Promise.resolve({data: { title: ERROR_ID, body: "error" }}));
            service.checkDifference3D("test3D", "user", "1")
                .then(
                    (update: Game3DRoomUpdate) => {
                        expect(update.differencesFound).to.equal(-1);
                        done();
                    },
                    (error: string) => {
                        done(error);
                    });
        });
    });
    //TODO: it fails
    describe("End a game", () => {
        it("Ending a game room should send a put request", async () => {
            const mockEndGameMessage: EndGameMessage = {
                username: "user",
                score: "1:23",
                gameId: "1",
                gameType: "test",
            };
            const mockScoreUpdate: ScoreUpdate = {
                id: "1",
                solo: [],
                multi: [],
                insertPos: 2,
                gameType: "test",
            };
            sandbox.on(Axios, "post", async () => Promise.resolve({data: { title: BASE_ID, body: "ok" }}));
            await service.createNewGameRoom({gameRoomId: "1", gameName: "bob", username: "user", is3D: false});
            sandbox.restore(Axios);
            sandbox.on(Axios, "put", async () => Promise.resolve({data: { title: BASE_ID, body: mockScoreUpdate }}));
            service.endGame(mockEndGameMessage).then(
                (response: NewScoreUpdate) => {
                    expect(response.username).to.equal("user");
                },
            );
        });
    });
    describe("Deleting a game room", () => {
        it("Deleting a game room should send a delete request", async () => {
            const spy: ChaiSpies.Spy = sandbox.on(Axios, "delete", async () => Promise.resolve());
            await service.deleteGameRoom("test");
            expect(spy).to.have.been.called();
        });
        it("Deleting a game 3D room should send a delete request", async () => {
            const spy: ChaiSpies.Spy = sandbox.on(Axios, "delete", async () => Promise.resolve());
            await service.deleteGame3DRoom("test3D");
            expect(spy).to.have.been.called();
        });
    });
});
