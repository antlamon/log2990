import chai = require("chai");
import spies = require("chai-spies");
import * as SocketClientIO from "socket.io-client";
import { container } from "../inversify.config";
import { Server } from "../server";
import { ImageService } from "../services/image.service";
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
    let server: Server;
    let nbUser: number;

    before((done: Mocha.Done) => {
        container.snapshot();
        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        container.rebind(TYPES.ImageService).toConstantValue(imageService);
        sandbox.on(imageService, "imageToString64", () => "");
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

    it("Should the socket disconnect, the user must be removed from userManger", (done: Mocha.Done) => {
        nbUser = testManager["userManager"].users.length;
        mockClientSocket.disconnect();
        setTimeout(() => {
            expect(testManager["userManager"].users.length).to.equal(nbUser - 1);
            done();
        },         CONNEXION_DELAY);
    });

});
