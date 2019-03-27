import chai = require("chai");
import spies = require("chai-spies");
import * as SocketClientIO from "socket.io-client";
import { NewScoreUpdate, ScoreUpdate } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { container } from "../inversify.config";
import { Server } from "../server";
import { GameRoomService } from "../services/rooms/gameRoom.service";
import { TYPES } from "../types";
import { SocketServerManager } from "./socketServerManager";

const expect: Chai.ExpectStatic = chai.expect;
const SERVER_URL: string = "http://localhost:3000/";
const CONNEXION_DELAY: number = 100;
chai.use(spies);
describe("Test for the socketServerManager", () => {

    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    let mockClientSocket: SocketIOClient.Socket;
    let testManager: SocketServerManager;
    let gameRoomService: GameRoomService;
    let server: Server;
    let nbUser: number;

    before((done: Mocha.Done) => {
        container.snapshot();
        gameRoomService = container.get(TYPES.GameRoomService);
        container.rebind(TYPES.GameRoomService).toConstantValue(gameRoomService);
        testManager = container.get<SocketServerManager>(TYPES.SocketServerManager);
        server = container.get<Server>(TYPES.Server);
        server.init();
        nbUser = testManager["userManager"]["users"].length;
        mockClientSocket = SocketClientIO.connect(SERVER_URL);
        mockClientSocket.on("connect", () => {
            done();
        });
    });

    after(() => {
        if (mockClientSocket.connected) {
            mockClientSocket.disconnect();
        }
        container.restore();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should send the socket id to the userManager once a socket connect", () => {
        expect(testManager["userManager"]["users"].length).to.equal(nbUser + 1);
    });

    it("The function emit event should emit only once by socket", (done: Mocha.Done) => {
        mockClientSocket.on("testEvent", () => {
            done();
        });
        testManager.emitEvent("testEvent");
    });

    it("Should handle new-game-room event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CREATE_GAME_ROOM, () => {
            mockClientSocket.off(SocketsEvents.CREATE_GAME_ROOM);
            done();
        });
        sandbox.on(gameRoomService, "createNewGameRoom", async () => Promise.resolve("123"));
        mockClientSocket.emit(SocketsEvents.CREATE_GAME_ROOM);
    });

    it("Should handle new-game-room event with rejected promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CREATE_GAME_ROOM, (rejection: string) => {
            mockClientSocket.off(SocketsEvents.CREATE_GAME_ROOM);
            expect(rejection).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "createNewGameRoom", async () => Promise.reject({ message: "123" }));
        mockClientSocket.emit(SocketsEvents.CREATE_GAME_ROOM);
    });

    it("Should handle check difference event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CHECK_DIFFERENCE, (gameRoom: string) => {
            expect(gameRoom).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "checkDifference", async () => Promise.resolve("123"));
        mockClientSocket.emit(SocketsEvents.CHECK_DIFFERENCE, { gameRoomId: "123" });
    });

    it("Should handle check difference 3D event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CHECK_DIFFERENCE_3D, (gameRoom: string) => {
            expect(gameRoom).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "checkDifference3D", async () => Promise.resolve("123"));
        mockClientSocket.emit(SocketsEvents.CHECK_DIFFERENCE_3D, { gameRoomId: "123" });
    });

    it("Should handle end game event with resolved promise", (done: Mocha.Done) => {
        const mockedNewScoredUpdate: NewScoreUpdate = {
            username: "test",
            gameMode: "solo",
            gameName: "hello",
            scoreUpdate: {
                id: "123",
                gameType: "simple",
                insertPos: 1,
                solo: [],
                multi: [],
            },
        };
        mockClientSocket.on(SocketsEvents.SCORES_UPDATED, (scoreUpdate: ScoreUpdate) => {
            expect(scoreUpdate).to.eql(mockedNewScoredUpdate.scoreUpdate);
        });
        mockClientSocket.on(SocketsEvents.NEW_BEST_TIME, (newScoreUpdate: NewScoreUpdate) => {
            expect(newScoreUpdate).to.eql(mockedNewScoredUpdate);
            done();
        });
        sandbox.on(gameRoomService, "endGame", async () => Promise.resolve(mockedNewScoredUpdate));
        mockClientSocket.emit(SocketsEvents.END_GAME, {gameId: "123"} );
    });

    it("Should handle delete game  room event", (done: Mocha.Done) => {
        const spy: ChaiSpies.Spy = sandbox.on(gameRoomService, "deleteGameRoom", async () => Promise.resolve());
        mockClientSocket.emit(SocketsEvents.DELETE_GAME_ROOM, "123");
        setTimeout(
            () => {
                expect(spy).to.have.been.called();
                done();
            },
            CONNEXION_DELAY);
    });
    it("Should handle delete game 3D room event", (done: Mocha.Done) => {
        const spy: ChaiSpies.Spy = sandbox.on(gameRoomService, "deleteGame3DRoom", async () => Promise.resolve());
        mockClientSocket.emit(SocketsEvents.DELETE_GAME_3D_ROOM, "123");
        setTimeout(
            () => {
                expect(spy).to.have.been.called();
                done();
            },
            CONNEXION_DELAY);
    });

    it("Should the socket disconnect, the user must be removed from userManager", (done: Mocha.Done) => {
        nbUser = testManager["userManager"]["users"].length;
        mockClientSocket.disconnect();
        setTimeout(
            () => {
                expect(testManager["userManager"]["users"].length).to.equal(nbUser - 1);
                done();
            },
            CONNEXION_DELAY);
    });

});
