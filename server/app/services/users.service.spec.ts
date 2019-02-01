import chai = require("chai");
import spies = require("chai-spies");
import SocketIO = require("socket.io-client");
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { UsersManager } from "./users.service";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("User service", () => {
    const socket: SocketIOClient.Socket = SocketIO("localhost:3000");
    const service: UsersManager = container.get<UsersManager>(TYPES.UserManager);

    it("Adding a user should add it to the array of user", (done: MochaDone) => {
        const nbUsers: number = service.users.length;
        socket.connect();
        expect(nbUsers).to.be.lessThan(service.users.length);
    });
});
