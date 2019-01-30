import { injectable } from "inversify";
import "reflect-metadata";
import * as SocketIO from "socket.io";
import { IUser } from "./IUser";
type Socket = SocketIO.Socket;

@injectable()
export class UsersManager {
    public users: IUser[];

    public constructor() {
        this.users = [];
    }

    public addUser(userSocket: Socket): void {
        this.users.push({ username: "--", socket: userSocket });
        userSocket.on("disconnect", () => {
            this.removeUser(userSocket.client.id);
        });
    }

    public setUserName(username: string, socketId: string): boolean {
        if (username === null || socketId === null) {
            return false;
        }
        const index: number = this.users.findIndex((x: IUser) => x.socket.client.id === socketId);
        if (index === -1) {
            return false;
        }
        this.users[index].username = username;

        return true;
    }
    private removeUser(socketId: string): boolean {
        const index: number = this.users.findIndex((x: IUser) => x.socket.client.id === socketId);
        if (index === -1) {
            return false;
        }
        this.users.splice(index, 1);

        return true;
    }

    public getUser(username: string): IUser {
        const index: number = this.users.findIndex((x: IUser) => x.username === username);
        if (index === -1) {
            return this.users[index];
        }

        return this.users[index];
    }

    public userExist(username: string): boolean {
        const index: number = this.users.findIndex((x: IUser) => x.username === username);
        if (index === -1) {
            return false;
        }

        return true;
    }

    public emitEvent(event: string): void {
        this.users.forEach((user: IUser) => {
            user.socket.emit(event);
        });
    }
}
export let usersManagerInstance: UsersManager = new UsersManager();
