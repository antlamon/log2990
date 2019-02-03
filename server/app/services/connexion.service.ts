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
            return {title: ERROR_ID, body: `The name is not the correct length must be between
            ${ConnexionService.MIN_USERNAME_LENGTH} and ${ConnexionService.MAX_USERNAME_LENGTH}`};
        }
        if (!ConnexionService.containOnlyAlphaNumeric(newName)) {
            return {title: ERROR_ID, body: "Name must contain only alpha numerics"};
        }

        if (this.userManager.userExist(newName)) {
            return {title: ERROR_ID, body: "Name was already taken"};
        }

        this.userManager.setUserName(newName, id);

        return {
            title: BASE_ID,
            body: `The name ${newName} was added to the list of names`,
        };
    }
}
