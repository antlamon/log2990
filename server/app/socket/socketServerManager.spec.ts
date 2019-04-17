import chai = require("chai");
import spies = require("chai-spies");
import * as SocketClientIO from "socket.io-client";
import { Game3DRoomUpdate, GameRoomUpdate, NewGameStarted, NewScoreUpdate, INewGameMessage, NewMultiplayerGame } from "../../../common/communication/message";
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
            testManager["userManager"].setUserName("mock", mockClientSocket.id);
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

    it("Receiving Start multiplayer event should send the same event", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.START_MULTIPLAYER_GAME, (gameMessage: INewGameMessage) => {
            expect(gameMessage.gameRoomId).to.eql("123");
            done();
        });
        sandbox.on(gameRoomService, "joinGameRoom", () => Promise.resolve());
        mockClientSocket.emit(SocketsEvents.START_MULTIPLAYER_GAME, {gameRoomId: "123"});
    });

    it("Receiving New multiplayer event should send the same event", (done: Mocha.Done) => {
        const multiplayerGame: NewMultiplayerGame = {
            gameId: "123",
            gameRoomId: "12345",
        };
        mockClientSocket.on(SocketsEvents.NEW_MULTIPLAYER_GAME, (newMultiplayerGame: NewMultiplayerGame) => {
            expect(newMultiplayerGame).to.eql(multiplayerGame);
            mockClientSocket.off(SocketsEvents.NEW_MULTIPLAYER_GAME);
            done();
        });
        sandbox.on(gameRoomService, "createWaitingGameRoom", () => multiplayerGame);
        mockClientSocket.emit(SocketsEvents.NEW_MULTIPLAYER_GAME);
    });

    it("Receiving Cancel multiplayer should send the same event", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CANCEL_MULTIPLAYER_GAME, (id: {gameId: String}) => {
            expect(id.gameId).to.eql("123");
            done();
        });
        sandbox.on(gameRoomService, "cancelWaitingRoom", () => Promise.resolve());
        mockClientSocket.emit(SocketsEvents.CANCEL_MULTIPLAYER_GAME, "123");
    });

    it("Receving New Game list loaded should send the new multiplayer game event", (done: Mocha.Done) => {
        const multiplayerGame: NewMultiplayerGame = {
            gameId: "123",
            gameRoomId: "12345",
        };
        mockClientSocket.on(SocketsEvents.NEW_MULTIPLAYER_GAME, (gameMessage: NewMultiplayerGame) => {
            expect(gameMessage).to.eql(multiplayerGame);
            done();
        });
        sandbox.on(gameRoomService, "findWaitingGameRooms", () => [multiplayerGame]);
        mockClientSocket.emit(SocketsEvents.NEW_GAME_LIST_LOADED);
    });

    it("Should handle new-game-room event with resolved promise", (done: Mocha.Done) => {
        const mockedNewGameStarted: NewGameStarted = {
            gameRoomId: "123",
            players: [{ username: "user", isReady: true, differencesFound: 0 }],
        };
        mockClientSocket.on(SocketsEvents.CREATE_GAME_ROOM, (newGame: NewGameStarted) => {
            mockClientSocket.off(SocketsEvents.CREATE_GAME_ROOM);
            expect(newGame.gameRoomId).to.eql(mockedNewGameStarted.gameRoomId);
            done();
        });
        sandbox.on(gameRoomService, "startGameRoom", async () => Promise.resolve(mockedNewGameStarted));
        mockClientSocket.emit(SocketsEvents.CREATE_GAME_ROOM);
    });

    it("Should handle new-game-room event with rejected promise", (done: Mocha.Done) => {
        const spy: ChaiSpies.Spy = sandbox.on(console, "error", () => 1);
        sandbox.on(gameRoomService, "startGameRoom", async () => Promise.reject(new Error("123")));
        mockClientSocket.emit(SocketsEvents.CREATE_GAME_ROOM);
        setTimeout(
            () => {
                expect(spy).to.have.been.called();
                done();
            },
            // tslint:disable-next-line:no-magic-numbers
            50);
    });

    it("Should handle check difference event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CHECK_DIFFERENCE, (update: GameRoomUpdate) => {
            expect(update.username).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "checkDifference", async () => Promise.resolve({ username: "123" }));
        mockClientSocket.emit(SocketsEvents.CHECK_DIFFERENCE, { gameRoomId: "123" });
    });

    it("Should handle check difference 3D event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CHECK_DIFFERENCE_3D, (update: Game3DRoomUpdate) => {
            expect(update.username).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "checkDifference3D", async () => Promise.resolve({ username: "123" }));
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
        mockClientSocket.on(SocketsEvents.SCORES_UPDATED, (newScoreUpdate: NewScoreUpdate) => {
            expect(newScoreUpdate).to.eql(mockedNewScoredUpdate);
            done();
        });
        sandbox.on(gameRoomService, "endGame", async () => Promise.resolve(mockedNewScoredUpdate));
        mockClientSocket.emit(SocketsEvents.END_GAME, { gameId: "123" });
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
