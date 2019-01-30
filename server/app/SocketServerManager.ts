import * as http from "http";
import * as SocketIO from "socket.io";
import { injectable, inject } from "inversify";
import {UsersManagerInstance} from "./services/users.service";

type Socket = SocketIO.Socket;
@injectable()
export class SocketServerManager{
    private socketServer:SocketIO.Server;
    public startServer(server:http.Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("onconnect",(socket:Socket)=>{
            UsersManagerInstance.addUser(socket);
        })
    }
}