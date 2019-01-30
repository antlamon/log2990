import { Message,ERROR_ID,BASE_ID } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable } from "inversify";
import {NAMES} from "../mock-names";
import {UsersManagerInstance} from "./users.service";

@injectable()
export class ConnexionService {
    public static readonly MIN_LENGTH: number = 3;
    public static readonly MAX_LENGTH: number = 10;

    public names: string[];

    constructor(){
        this.names=NAMES;
    }

    public async addName(newName:string,id:string): Promise<Message> {

        if(newName ===null)
            return {title:ERROR_ID,body:"Name is null"};
        if(!ConnexionService.isCorrectLength(newName))
            return {title:ERROR_ID,body:"Name is not the correct length it must be between "+ConnexionService.MIN_LENGTH+" and "+ConnexionService.MAX_LENGTH};
        if(!ConnexionService.containOnlyAlphaNumeric(newName))
            return {title:ERROR_ID,body:"Name must contain only alpha numerics"};
        //Checker si dans liste
        if(UsersManagerInstance.userExist(newName))
            return {title:ERROR_ID,body:"Name was already taken"};

        //Mock-data
        UsersManagerInstance.setUserName(newName,id);
        return {title:BASE_ID,body:"The name"+newName+" was added to the list of names"};
    }
    public static isCorrectLength(nom: string): boolean {
        if(nom===null) {
            return false;
        }
        return nom.length <= this.MAX_LENGTH && nom.length >= this.MIN_LENGTH;
    }
    public static containOnlyAlphaNumeric(nom: string): boolean {
        if(nom===null) {
            return false;
        }
        const check: RegExpMatchArray | null = nom.match(/^[a-zA-Z0-9]+$/i);

        return check === null ? false : check[0].length === nom.length;
    }
}
