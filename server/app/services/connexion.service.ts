import { injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { usersManagerInstance } from "./users.service";

@injectable()
export class ConnexionService {
    public static readonly MIN_LENGTH: number = 3;
    public static readonly MAX_LENGTH: number = 10;

    public static isCorrectLength(nom: string): boolean {
        return nom.length <= this.MAX_LENGTH && nom.length >= this.MIN_LENGTH;
    }
    public static containOnlyAlphaNumeric(nom: string): boolean {
        const tryRegex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/i);

        return tryRegex.test(nom);
    }

    public async addName(newName: string, id: string): Promise<Message> {
        if (!ConnexionService.isCorrectLength(newName)) {
            return {title: ERROR_ID, body: "Name is not the correct length it must be between "
                    + ConnexionService.MIN_LENGTH + " and " + ConnexionService.MAX_LENGTH};
        }
        if (!ConnexionService.containOnlyAlphaNumeric(newName)) {
            return {title: ERROR_ID, body: "Name must contain only alpha numerics"};
        }
        // Checker si dans liste
        if (usersManagerInstance.userExist(newName)) {
            return {title: ERROR_ID, body: "Name was already taken"};
        }

        // Mock-data
        usersManagerInstance.setUserName(newName, id);

        return {title: BASE_ID, body: "The name" + newName + " was added to the list of names"};
    }
}
