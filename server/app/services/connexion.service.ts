import { Message } from "../../../common/communication/message";
import "reflect-metadata";
import { injectable } from "inversify";
import {NAMES} from "../mock-names";

@injectable()
export class ConnexionService {

    public readonly MIN_LENGTH: number = 3;
    public readonly MAX_LENGTH: number = 10;

    public readonly  ERROR_ID: string = "error";
    public readonly  CONNECT_ID:string = "connected";

    public names: string[];

    constructor(){
        this.names=NAMES;
    }

    public async addName(newName:string): Promise<Message> {
        if(newName ==null)
            return {title:this.ERROR_ID,body:"Name is null"};
        if(!this.isCorrectLength(newName))
            return {title:this.ERROR_ID,body:"Name is not the correct length and must be between "+this.MIN_LENGTH+" and "+this.MAX_LENGTH};
        if(!this.containOnlyAlphaNumeric(newName))
            return {title:this.ERROR_ID,body:"Name must contain only alpha numerics"};
        //Checker si dans liste
        if(this.names.some(o => o == newName))
            return {title:this.ERROR_ID,body:"Name was already taken"};

        //Mock-data
        this.names.push(newName);
        return {title:this.CONNECT_ID,body:"The name"+newName+" was added to the list of names"};
    }
    public async removeName(newName:string): Promise<Message> {
        if(newName==null)
            return {title:this.ERROR_ID,body:"Name given is not valid"};
        const index = this.names.indexOf(newName, 0);
        if (index === -1) {
            return {title:this.ERROR_ID,body:"Name was not present"};
        }
        this.names.splice(index,1);
        return {title:this.CONNECT_ID,body:"The name"+newName+" was removed to the list of names"};
    }
    public isCorrectLength(nom: string): boolean {
        if(nom==null) {
            return false;
        }
        return nom.length <= this.MAX_LENGTH && nom.length >= this.MIN_LENGTH;
    }
    public containOnlyAlphaNumeric(nom: string): boolean {
        if(nom==null) {
            return false;
        }
        const check: RegExpMatchArray | null = nom.match(/^[a-zA-Z0-9]+$/i);

        return check == null ? false : check[0].length === nom.length;
    }
}
