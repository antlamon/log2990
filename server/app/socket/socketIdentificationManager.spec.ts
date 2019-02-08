import chai = require("chai");
import spies = require("chai-spies");
import * as SocketClientIO from "socket.io-client";
import { container } from "../inversify.config";
import { Server } from "../server";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";
import { SocketIdentificationManager } from "./socketIdentificationManager";
import { IdentificationService } from "../services/identification.service";
import { SocketsEvents } from "../../../common/communication/socketsEvents";

const expect: Chai.ExpectStatic = chai.expect;
const SERVER_URL: string = "http://localhost:3000/";
const CONNEXION_DELAY: number = 100;
chai.use(spies);

describe("Test for the socketServerManager", () => {

    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();
    let mockClientSocket: SocketIOClient.Socket;
    let testManager: SocketIdentificationManager;
    let server: Server;

    before(() => {
        container.snapshot();
        const imageService: ImageService = container.get<ImageService>(TYPES.ImageService);
        container.rebind(TYPES.ImageService).toConstantValue(imageService);
        sandbox.on(imageService, "imageToString64", () => "");
        sandbox.on(IdentificationService, "getDifference", () => "test");
        testManager = container.get<SocketIdentificationManager>(TYPES.SocketIdentificationManager);
        server = container.get<Server>(TYPES.Server);
        server.init();
        mockClientSocket = SocketClientIO.connect(SERVER_URL);
    });

    after(() => {
        if (mockClientSocket.connected) {
            mockClientSocket.disconnect();
        }
        container.restore();
        sandbox.restore();
    });

    it("The function emit event should emit only once by socket", (done: Mocha.Done) => {
        done();
        });
});
