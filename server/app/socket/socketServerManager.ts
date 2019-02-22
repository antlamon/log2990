import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { GameRoomService } from "../services/gameRoom.service";
import { UsersManager } from "../services/users.service";
import { TYPES } from "../types";

type Socket = SocketIO.Socket;

@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;

    public constructor( @inject(TYPES.UserManager) private userManager: UsersManager,
                        @inject(TYPES.GameRoomService) private gameRoomService: GameRoomService) { }

    public startServer(server: Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connect", (socket: Socket) => {
            this.userManager.addUser(socket.client.id);
            socket.on(SocketsEvents.CREATE_GAME_ROOM, (newGameMessage: NewGameMessage) => {
                this.handleNewGameRoom(socket, newGameMessage);
            });
            socket.on(SocketsEvents.CHECK_DIFFERENCE, (event: ImageClickMessage) => {
                this.handleCheckDifference(event);
            });
            socket.on("disconnect", () => {
                this.userManager.removeUser(socket.client.id);
            });
        });
    }

    public emitEvent(event: string): void {
        this.socketServer.emit(event);
    }

    private handleNewGameRoom(socket: Socket, newGameMessage: NewGameMessage): void {
        this.gameRoomService.createNewGameRoom(newGameMessage).then(
            (roomId: string) => {
                socket.join(roomId);
                this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, roomId);
            },
            (rejection: string) => {
                this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, socket.id, rejection);
            });
    }

    private handleCheckDifference(event: ImageClickMessage): void {
        this.gameRoomService.checkDifference(event.gameRoomId, event.username, event.point).then(
            (gameRoomUpdate: GameRoomUpdate) => {
                this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE, event.gameRoomId, gameRoomUpdate);
            });
    }

    private emitRoomEvent<T>(event: string, room: string, data?: T): void {
        this.socketServer.in(room).emit(event, data);
    }
}
