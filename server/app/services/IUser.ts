import { Socket } from "socket.io";
export interface IUser {
    username: string;
    socket: Socket;
}
