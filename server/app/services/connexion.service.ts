import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { TYPES } from "../types";
import { UsersManager } from "./users.service";

@injectable()
export class ConnexionService {
    public static readonly MIN_USERNAME_LENGTH: number = 3;
    public static readonly MAX_USERNAME_LENGTH: number = 10;

    public static isCorrectLength(nom: string): boolean {
        return nom.length <= this.MAX_USERNAME_LENGTH && nom.length >= this.MIN_USERNAME_LENGTH;
    }
    public static containOnlyAlphaNumeric(nom: string): boolean {
        const tryRegex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/i);

        return tryRegex.test(nom);
    }

    public constructor(@inject(TYPES.UserManager) private userManager: UsersManager) {}

    public async addName(newName: string, id: string): Promise<Message> {
        if (!ConnexionService.isCorrectLength(newName)) {
            return {title: ERROR_ID, body: `Le nom n'est pas de la bonne taile entre
            ${ConnexionService.MIN_USERNAME_LENGTH} et ${ConnexionService.MAX_USERNAME_LENGTH}`};
        }
        if (!ConnexionService.containOnlyAlphaNumeric(newName)) {
            return {title: ERROR_ID, body: "Le nom doit contenir seulement des charactères alphanumériques"};
        }

        if (this.userManager.userExist(newName)) {
            return {title: ERROR_ID, body: "Nom déjà choisi"};
        }

        this.userManager.setUserName(newName, id);

        return {
            title: BASE_ID,
            body: `Le nom ${newName} a été ajouté à la liste de noms`,
        };
    }
}
