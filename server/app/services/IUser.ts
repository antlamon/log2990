import * as SocketIO from 'socket.io';
type Socket= SocketIO.Socket;
export interface IUser {
    username: string;
    socket: Socket;
}
