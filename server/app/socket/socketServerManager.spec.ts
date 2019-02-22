import chai = require("chai");
import spies = require("chai-spies");
import * as SocketClientIO from "socket.io-client";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { container } from "../inversify.config";
import { Server } from "../server";
import { GameRoomService } from "../services/gameRoom.service";
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
        nbUser = testManager["userManager"].users.length;
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
        expect(testManager["userManager"].users.length).to.equal(nbUser + 1);
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
        sandbox.on(gameRoomService, "createNewGameRoom", async () => Promise.reject("123"));
        mockClientSocket.emit(SocketsEvents.CREATE_GAME_ROOM);
    });

    it("Should handle check difference event with resolved promise", (done: Mocha.Done) => {
        mockClientSocket.on(SocketsEvents.CHECK_DIFFERENCE, (gameRoom: string) => {
            expect(gameRoom).to.equal("123");
            done();
        });
        sandbox.on(gameRoomService, "checkDifference", async () => Promise.resolve("123"));
        mockClientSocket.emit(SocketsEvents.CHECK_DIFFERENCE, {gameRoomId : "123"});
    });

    it("Should the socket disconnect, the user must be removed from userManager", (done: Mocha.Done) => {
        nbUser = testManager["userManager"].users.length;
        mockClientSocket.disconnect();
        setTimeout(() => {
            expect(testManager["userManager"].users.length).to.equal(nbUser - 1);
            done();
        },         CONNEXION_DELAY);
    });

});
