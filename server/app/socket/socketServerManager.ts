import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { EndGameMessage, Game3DRoomUpdate, GameRoomUpdate, ImageClickMessage,
     INewGameMessage, NewScoreUpdate, Obj3DClickMessage } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { GameRoomService } from "../services/rooms/gameRoom.service";
import { UsersManager } from "../services/users.service";
import { TYPES } from "../types";

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
            socket.on(SocketsEvents.CREATE_GAME_ROOM, async (newGameMessage: INewGameMessage) => {
                await this.handleNewGameRoom(socket, newGameMessage);
            });
            socket.on(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
            socket.on(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference3D.bind(this));
            socket.on(SocketsEvents.DELETE_GAME_ROOM, async (gameRoomId: string) => {
                await this.handleDeleteGameRoom(socket, gameRoomId);
            });
            socket.on(SocketsEvents.DELETE_GAME_3D_ROOM, async (gameRoomId: string) => {
                await this.handleDeleteGame3DRoom(socket, gameRoomId);
            });
            socket.on(SocketsEvents.END_GAME, async (endGameMessage: EndGameMessage) => {
                await this.handleEndGame(socket, endGameMessage);
            });
            socket.on("disconnect", () => {
                this.emitEvent(SocketsEvents.USER_CONNECTION, this.userManager.getUsername(socket.client.id), "userDisconnected");
                this.userManager.removeUser(socket.client.id);
            });

        });
    }

    public emitEvent<T>(event: string, data?: T, dataType?: T): void {
        this.socketServer.emit(event, data, dataType);
    }

    private async handleNewGameRoom(socket: Socket, newGameMessage: INewGameMessage): Promise<void> {

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
    }

    private async handleCheckDifference3D(event: Obj3DClickMessage): Promise<void> {
        const update: Game3DRoomUpdate = await this.gameRoomService.checkDifference3D(event.gameRoomId, event.username, event.name);
        this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE_3D, event.gameRoomId, update);
        this.emitRoomEvent(SocketsEvents.NEW_GAME_MESSAGE, event.gameRoomId, update);
    }

    private async handleDeleteGameRoom(socket: Socket, gameRoomId: string): Promise<void> {
        socket.leave(gameRoomId);
        await this.gameRoomService.deleteGameRoom(gameRoomId);
    }

    private async handleDeleteGame3DRoom(socket: Socket, gameRoomId: string): Promise<void> {
        socket.leave(gameRoomId);
        await this.gameRoomService.deleteGame3DRoom(gameRoomId);
    }

    private async handleEndGame(socket: Socket, endGameMessage: EndGameMessage): Promise<void> {
        socket.leave(endGameMessage.gameId);
        const newScoreUpdate: NewScoreUpdate = await this.gameRoomService.endGame(endGameMessage);
        if (newScoreUpdate.scoreUpdate.insertPos !== -1) {
            this.emitEvent(SocketsEvents.SCORES_UPDATED, newScoreUpdate.scoreUpdate);
            this.emitEvent(SocketsEvents.NEW_BEST_TIME, newScoreUpdate);
        }
    }

    private emitRoomEvent<T>(event: string, room: string, data?: T): void {
        this.socketServer.in(room).emit(event, data);
    }
}
