import { Server } from "http";
import { injectable } from "inversify";
import * as SocketIO from "socket.io";
import { NewGameMessage, Point } from "../../../common/communication/socketMessages";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { container } from "../inversify.config";
import { ConvertImage } from "../services/convertImage.service";
import { IdentificationService } from "../services/identification.service";
import { TYPES } from "../types";

type Socket = SocketIO.Socket;

@injectable()
export class SocketIdentificationManager {
    private socketServer: SocketIO.Server;

    public initIdentificationSocket(server: Server): void {
        this.socketServer = SocketIO(server);
        this.socketServer.on("connection", (socket: Socket, data: NewGameMessage) => {
            const convertService: ConvertImage = container.get(TYPES.ConvertImage);
            const identificationService: IdentificationService =
                new IdentificationService(convertService, data.originalImagePath, data.modifiedImagePath, data.differencesImagePath);
            this.socketServer.on(SocketsEvents.CHECK_DIFFERENCE, (point: Point, fn: Function) => {
                fn(identificationService.getDifference(point.x, point.y));
            });
        });
    }
}
