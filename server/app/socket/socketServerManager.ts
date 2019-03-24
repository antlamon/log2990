import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { GameRoomService } from "../services/rooms/gameRoom.service";
import { UsersManager } from "../services/users.service";
import { TYPES } from "../types";
// import { IMessageForm } from "../../../common/models/simpleGameMessage";
// import { GameMessageService } from "../services/game-message.service";

type Socket = SocketIO.Socket;

@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;

    public constructor( @inject(TYPES.UserManager) private userManager: UsersManager,
                        @inject(TYPES.GameRoomService) private gameRoomService: GameRoomService) { }

    public initializeSocket(server: Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connect", (socket: Socket) => {
            this.userManager.addUser(socket.client.id);
            socket.on(SocketsEvents.CREATE_GAME_ROOM, async (newGameMessage: NewGameMessage) => {
                await this.handleNewGameRoom(socket, newGameMessage);
            });
            socket.on(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
            socket.on(SocketsEvents.DELETE_GAME_ROOM, async (gameRoomId: string) => {
                await this.handleDeleteGameRoom(socket, gameRoomId);
            });
            socket.on("disconnect", () => {
                this.emitEvent(SocketsEvents.USER_DECONNECTION, this.userManager.getUsername(socket.client.id));
                this.userManager.removeUser(socket.client.id);
            });
            // socket.on(SocketsEvents.NEW_GAME_MESSAGE, async (newMessage: IMessageForm) => {
            //     await this.identificationMessage(socket, newMessage);
            // });
        });
    }

    public emitEvent<T>(event: string, data?: T): void {
        this.socketServer.emit(event, data);
    }

    private async handleNewGameRoom(socket: Socket, newGameMessage: NewGameMessage): Promise<void> {
        try {
            const roomId: string = await this.gameRoomService.createNewGameRoom(newGameMessage);
            socket.join(roomId);
            this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, roomId);
        } catch (rejection) {
            this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, socket.id, rejection.message);
        }
    }

    private async handleCheckDifference(event: ImageClickMessage): Promise<void> {
        const update: GameRoomUpdate = await this.gameRoomService.checkDifference(event.gameRoomId, event.username, event.point);
        this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE, event.gameRoomId, update);
        this.emitRoomEvent(SocketsEvents.NEW_GAME_MESSAGE, event.gameRoomId, update);
    }

    private async handleDeleteGameRoom(socket: Socket, gameRoomId: string): Promise<void> {
        socket.leave(gameRoomId);
        this.emitRoomEvent(SocketsEvents.USER_LEAVE_GAME, gameRoomId);
        await this.gameRoomService.deleteGameRoom(gameRoomId);
    }

    private emitRoomEvent<T>(event: string, room: string, data?: T): void {
        this.socketServer.in(room).emit(event, data);
    }

    // private async identificationMessage(socket: Socket, newMessage: IMessageForm): Promise<void> {
    //     await this.gameMessageService.sendMessage(newMessage);

    // }
}
