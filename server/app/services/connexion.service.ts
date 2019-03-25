import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { FormValidatorService } from "./formValidator.service";
import { UsersManager } from "./users.service";

@injectable()
export class ConnexionService {
    public static readonly MIN_USERNAME_LENGTH: number = 3;
    public static readonly MAX_USERNAME_LENGTH: number = 10;

    public constructor(@inject(TYPES.UserManager) private userManager: UsersManager,
                       @inject(TYPES.FormValidatorService) private formValidator: FormValidatorService,
                       @inject(TYPES.SocketServerManager) private socket: SocketServerManager) {}

    public async addName(newName: string, id: string): Promise<Message> {
        if (!this.formValidator.isCorrectLength(newName, ConnexionService.MIN_USERNAME_LENGTH, ConnexionService.MAX_USERNAME_LENGTH )) {
            return {title: ERROR_ID, body: `Le nom n'est pas de la bonne taile entre
            ${ConnexionService.MIN_USERNAME_LENGTH} et ${ConnexionService.MAX_USERNAME_LENGTH}`};
        }
        if (!this.formValidator.containOnlyAlphaNumeric(newName)) {
            return {title: ERROR_ID, body: "Le nom doit contenir seulement des charactères alphanumériques"};
        }

        if (this.userManager.userExist(newName)) {
            return {title: ERROR_ID, body: "Nom déjà choisi"};
        }

        this.userManager.setUserName(newName, id);
        this.socket.emitEvent(SocketsEvents.USER_CONNECTION, newName, "userConnected");

        return {
            title: BASE_ID,
            body: `Le nom ${newName} a été ajouté à la liste de noms`,
        };
    }
}
