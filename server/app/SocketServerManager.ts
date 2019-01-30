import * as http from "http";
import { injectable} from "inversify";
import * as SocketIO from "socket.io";
import {UsersManagerInstance} from "./services/users.service";

type Socket = SocketIO.Socket;
@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;
    public startServer(server: http.Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connect", (socket: Socket) => {
            UsersManagerInstance.addUser(socket);
        });
    }
}
