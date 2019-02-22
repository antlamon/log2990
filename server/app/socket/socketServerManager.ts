import { Server } from "http";
import { inject, injectable } from "inversify";
import * as SocketIO from "socket.io";
import { GameRoomUpdate, NewGameMessage, Point } from "../../../common/communication/message";
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
            socket.on(SocketsEvents.CHECK_DIFFERENCE, (gameRoomId: string, username: string, point: Point) => {
                this.handleCheckDifference(gameRoomId, username, point);
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
        this.gameRoomService.createNewGameRoom({
            originalImagePath: "./app/documents/test-images/image_test_1.bmp",
            modifiedImagePath: "./app/documents/test-images/image_test_2.bmp",
            differenceImagePath: "./app/documents/test-images/image_result.bmp",
            username: "alloa",
            gameRoomId: "alloa",
        }).then(
            (roomId: string) => {
                socket.join(roomId);
                this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, roomId, null);
            },
            (rejection: string) => {
                this.emitRoomEvent(SocketsEvents.CREATE_GAME_ROOM, socket.id, rejection);
            });
    }

    private handleCheckDifference(gameRoomId: string, username: string, point: Point): void {
        this.gameRoomService.checkDifference(gameRoomId, username, point).then(
            (gameRoomUpdate: GameRoomUpdate) => {
                this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE, gameRoomId, gameRoomUpdate);
            },
            (rejection: string) => {
                this.emitRoomEvent(SocketsEvents.CHECK_DIFFERENCE, gameRoomId, rejection);
            });
    }

    // tslint:disable-next-line:no-any
    private emitRoomEvent(event: string, room: string, data: any): void {
        this.socketServer.in(room).emit(event, data);
    }
}
