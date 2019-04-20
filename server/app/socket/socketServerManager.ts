import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import {
    EndGameMessage, Game3DRoomUpdate, Gamer, GameRoomUpdate, ImageClickMessage,
    INewGameMessage, NewGameStarted, NewMultiplayerGame, NewScoreUpdate, Obj3DClickMessage
} from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { GameRoomService } from "../services/rooms/gameRoom.service";
import { UsersManager } from "../services/users.service";
import { TYPES } from "../types";

type Socket = SocketIO.Socket;

@injectable()
export class SocketServerManager {
    private socketServer: SocketIO.Server;

    public constructor(@inject(TYPES.UserManager) private userManager: UsersManager,
                       @inject(TYPES.GameRoomService) private gameRoomService: GameRoomService) { }

    public initializeSocket(server: Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on(SocketsEvents.SOCKET_CONNECTION, (socket: Socket) => {
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
            socket.on(SocketsEvents.SOCKET_DISCONNECTION, () => {
                const userName: string = this.userManager.getUsername(socket.client.id);
                this.userManager.removeUser(socket.client.id);
                if (userName) {
                    this.emitEvent(SocketsEvents.USER_CONNECTION, userName, "userDisconnected");
                }
            });
            this.initializeMultiplayerGame(socket);
        });
    }

    private initializeMultiplayerGame(socket: Socket): void {
        socket.on(SocketsEvents.NEW_MULTIPLAYER_GAME, async (gameMessage: INewGameMessage) => {
            const newMultiplayerGame: NewMultiplayerGame = this.gameRoomService.createWaitingGameRoom(gameMessage);
            this.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, newMultiplayerGame);
        });
        socket.on(SocketsEvents.START_MULTIPLAYER_GAME, async (gameMessage: INewGameMessage) => {
            if (gameMessage.gameRoomId) {
                this.gameRoomService.joinGameRoom(gameMessage.username, gameMessage.gameRoomId);
                this.emitEvent(SocketsEvents.START_MULTIPLAYER_GAME, gameMessage);
            }
        });
        socket.on(SocketsEvents.CANCEL_MULTIPLAYER_GAME, (id: string) => {
            this.gameRoomService.cancelWaitingRoom(id);
            this.emitEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, {gameId: id});
        });
        socket.on(SocketsEvents.NEW_GAME_LIST_LOADED, () => {
            const waitingRooms: NewMultiplayerGame[] = this.gameRoomService.findWaitingGameRooms();
            for (const room of waitingRooms) {
                this.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, room);
            }
        });
    }
    public emitEvent<T>(event: string, data?: T, dataType?: T): void {
        this.socketServer.emit(event, data, dataType);
    }

    private async handleNewGameRoom(socket: Socket, newGameMessage: INewGameMessage): Promise<void> {
        try {
            const newGameStarted: NewGameStarted = await this.gameRoomService.startGameRoom(newGameMessage);
            socket.join(newGameStarted.gameRoomId);
            if (!newGameStarted.players.some((gamer: Gamer) => !gamer.isReady)) {
                this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, newGameStarted.gameRoomId, newGameStarted);
            }
        } catch (rejection) {
            console.error(rejection);
        }
    }

    private async handleCheckDifference(event: ImageClickMessage): Promise<void> {
        const update: GameRoomUpdate = await this.gameRoomService.checkDifference(event.gameRoomId, event.username, event.point);
        this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE, event.gameRoomId, update);
    }

    private async handleCheckDifference3D(event: Obj3DClickMessage): Promise<void> {
        const update: Game3DRoomUpdate = await this.gameRoomService.checkDifference3D(event.gameRoomId, event.username, event.name);
        this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE_3D, event.gameRoomId, update);
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
        socket.leave(endGameMessage.gameRoomId);
        const newScoreUpdate: NewScoreUpdate = await this.gameRoomService.endGame(endGameMessage);
        if (newScoreUpdate.scoreUpdate.insertPos !== -1) {
            this.emitEvent(SocketsEvents.SCORES_UPDATED, newScoreUpdate);
        }
    }

    private emitRoomEvent<T>(event: string, room: string, data?: T): void {
        this.socketServer.in(room).emit(event, data);
    }
}
