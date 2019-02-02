
import { inject, injectable } from "inversify";
import "reflect-metadata";

import { GAMESSIMPLE,GAMESFREE } from "../mock-games";
import { ImageService } from "./image.service";
import { TYPES } from "../types";
import { Message, ERROR_ID,BASE_ID } from "../../../common/communication/message";
import {SocketsEvents} from "../../../common/communication/SocketsEvents"
import { usersManagerInstance } from "./users.service";
import { IGame, ISolo } from "../../../common/models/game";

import { writeFileSync } from "fs";


@injectable()
export class GameListService {


    public constructor(@inject(TYPES.ImageService)private imageService: ImageService){
        //for sprint1, load the image as string64. Will be changed for a database
        for(let i:number=0; i < GAMESSIMPLE.length;i++)
        {
            GAMESSIMPLE[i].imageURL =  this.imageService.imageToString64(GAMESSIMPLE[i].imageURL);
        }
    }

    public async getSimpleGames(): Promise<IGame[]> {
        return GAMESSIMPLE;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return GAMESFREE;
    }

    public async addFreeGame(newGame: IGame): Promise<IGame>{
        //Not implemented for sprint1
        GAMESFREE.push(newGame);//mock-data for sprint1 
        return(newGame);
    }
    public async deleteSimpleGame(gameName:string): Promise<Message> {
        const index: number = GAMESSIMPLE.findIndex((x: IGame) => x.name ===gameName);
        if (index === -1) {
            return {title:ERROR_ID,body:"Le jeu ${gameName} n'existe pas"};
        }
        GAMESSIMPLE.splice(index, 1);
        usersManagerInstance.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

        return {title:BASE_ID,body:"Le jeu ${gameName} a été supprimer"};;
    }
    public async deleteFreeGame(gameName:string): Promise<Message> {
        const index: number = GAMESFREE.findIndex((x: IGame) => x.name ===gameName);
        if (index === -1) {
            return {title:ERROR_ID,body:"Le jeu ${gameName} n'existe pas"};
        }
        GAMESFREE.splice(index, 1);
        usersManagerInstance.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return {title:BASE_ID,body:"Le jeu ${gameName} a été supprimer"};
    }

    public async addSimpleGame(newGame: ISolo, originalBuffer: Buffer, modifiedBuffer: Buffer): Promise<Message> {
        const name: string = newGame.name;
        const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
        writeFileSync("./app/documents/original"+name+".bmp", originalBuffer);
        const game: IGame = {name: message.title, imageURL: "./app/documents/"+ name +".bmp", solo: {first: 1, second: 2,third: 3}, multi:  {first: 1, second: 2,third: 3} }
        GAMESSIMPLE.push(game);
        return(message);
    }

}
