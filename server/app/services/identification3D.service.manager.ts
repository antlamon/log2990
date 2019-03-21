import { injectable } from "inversify";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IGame3D } from "../../../common/models/game3D";
import { Identification3DService } from "./identification3D.service";

interface IDictionary {
    [index: string]: Identification3DService;
}

@injectable()
export class Identification3DServiceManager {

    public static readonly IDENTIFICATION_SERVICE_NOT_FOUND: string = "Le service d'identification pour ce jeu n'est pas instancié";
    public static readonly NO_DIFFERENCE_FOUND: string = "Aucune différence trouvée";
    public static readonly GAMEROOMID_ALREADY_EXISTS: string = "Le service pour ce game room existe deja";

    private identificationServices: IDictionary;

    public constructor() {
        this.identificationServices = {} as IDictionary;
    }

    public getDifference(gameRoomId: string, objName: string): Message {
        if (this.identificationServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        const object: string = this.identificationServices[gameRoomId].getDifference(objName);
        if (object === undefined) {
            return {
                title: ERROR_ID,
                body: Identification3DServiceManager.NO_DIFFERENCE_FOUND,
            };
        }

        return {
            title: BASE_ID,
            body: object,
        };
    }

    public startNewService(gameRoomId: string, game: IGame3D)
        : Message {
        if (this.identificationServices[gameRoomId] !== undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.GAMEROOMID_ALREADY_EXISTS}, Game room:${gameRoomId}`,
            };
        }

        this.identificationServices[gameRoomId] = new Identification3DService(game);

        return {
            title: BASE_ID,
            body: gameRoomId,
        };
    }

    public deleteService(gameRoomId: string): Message {
        if (this.identificationServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        delete this.identificationServices[gameRoomId];

        return {
            title: BASE_ID,
            body: `Service for ${gameRoomId} deleted`,
        };
    }
}
