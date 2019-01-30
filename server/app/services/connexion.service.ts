import { Message,ERROR_ID,BASE_ID } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable } from "inversify";
import {NAMES} from "../mock-names";
import {Socket} from "socket.io";

@injectable()
export class ConnexionService {
    public static readonly MIN_LENGTH: number = 3;
    public static readonly MAX_LENGTH: number = 10;

    public names: string[];

    constructor(){
        this.names=NAMES;
    }

    public async addName(newName:string): Promise<Message> {

        if(newName ===null)
            return {title:ERROR_ID,body:"Name is null"};
        if(!ConnexionService.isCorrectLength(newName))
            return {title:ERROR_ID,body:"Name is not the correct length and must be between "+ConnexionService.MIN_LENGTH+" and "+ConnexionService.MAX_LENGTH};
        if(!ConnexionService.containOnlyAlphaNumeric(newName))
            return {title:ERROR_ID,body:"Name must contain only alpha numerics"};
        //Checker si dans liste
        if(this.names.some(o => o == newName))
            return {title:ERROR_ID,body:"Name was already taken"};

        //Mock-data
        this.names.push(newName);
        return {title:BASE_ID,body:"The name"+newName+" was added to the list of names"};
    }
    public async removeName(newName:string): Promise<Message> {
        if(newName===null)
            return {title:ERROR_ID,body:"Name given is not valid"};
        const index = this.names.indexOf(newName, 0);
        if (index === -1) {
            return {title:ERROR_ID,body:"Name was not present"};
        }
        this.names.splice(index,1);
        return {title:BASE_ID,body:"The name"+newName+" was removed to the list of names"};
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
