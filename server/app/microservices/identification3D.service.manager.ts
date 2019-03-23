import { injectable } from "inversify";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IDifference } from "../../../common/models/game3D";
import { Identification3DService } from "./identification3D.service";

interface IDictionary {
    [index: string]: Identification3DService;
}

@injectable()
export class Identification3DServiceManager {

    public static readonly IDENTIFICATION_SERVICE_NOT_FOUND: string = "Le service d'identification pour ce jeu n'est pas instancié";
    public static readonly NO_DIFFERENCE_FOUND: string = "Aucune différence trouvée";
    public static readonly GAMEROOMID_ALREADY_EXISTS: string = "Le service pour ce game room existe deja";

    private identification3DServices: IDictionary;

    public constructor() {
        this.identification3DServices = {} as IDictionary;
    }

    public getDifference(gameRoomId: string, objName: string): Message {
        if (this.identification3DServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        const object: string = this.identification3DServices[gameRoomId].getDifference(objName);
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

    public startNewService(gameRoomId: string, differences: IDifference[]): Message {
        if (this.identification3DServices[gameRoomId] !== undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.GAMEROOMID_ALREADY_EXISTS}, Game room:${gameRoomId}`,
            };
        }

        this.identification3DServices[gameRoomId] = new Identification3DService(differences);

        return {
            title: BASE_ID,
            body: gameRoomId,
        };
    }

    public deleteService(gameRoomId: string): Message {
        if (this.identification3DServices[gameRoomId] === undefined) {
            return {
                title: ERROR_ID,
                body: `${Identification3DServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, Game room: ${gameRoomId}`,
            };
        }
        delete this.identification3DServices[gameRoomId];

        return {
            title: BASE_ID,
            body: `Service for ${gameRoomId} deleted`,
        };
    }
}
