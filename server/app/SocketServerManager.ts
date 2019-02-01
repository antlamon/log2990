import * as http from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { UsersManager } from "./services/users.service";
import { TYPES } from "./types";

type Socket = SocketIO.Socket;
@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;

    public constructor(@inject(TYPES.UserManager) private userManager: UsersManager) {}

    public startServer(server: http.Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connect", (socket: Socket) => {
            this.userManager.addUser(socket);
        });
    }
}
