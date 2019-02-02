import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IGame } from "../../../common/models/game";
<<<<<<< HEAD
import { GAMESSIMPLE,GAMESFREE } from "../mock-games";
import { ImageService } from "./image.service";
import { TYPES } from "../types";
import { Message, ERROR_ID,BASE_ID } from "../../../common/communication/message";
import {SocketsEvents} from "../../../common/communication/SocketsEvents"
import { usersManagerInstance } from "./users.service";

=======
import { GAMES } from "../mock-games";
import { TYPES } from "../types";
import { ImageService } from "./image.service";
>>>>>>> f21406fdff9f8bc78d8b6964d935e74a7d6173f5

@injectable()
export class GameListService {

<<<<<<< HEAD
    public constructor(@inject(TYPES.ImageService)private imageService: ImageService){
        //for sprint1, load the image as string64. Will be changed for a database
        for(let i:number=0; i < GAMESSIMPLE.length;i++)
        {
            GAMESSIMPLE[i].imageURL =  this.imageService.imageToString64(GAMESSIMPLE[i].imageURL);
=======
    public constructor(@inject(TYPES.ImageService) private imageService: ImageService) {
        for (const game of GAMES) {
              game.imageURL =  this.imageService.imageToString64(game.imageURL);
>>>>>>> f21406fdff9f8bc78d8b6964d935e74a7d6173f5
        }
    }

    public async getSimpleGames(): Promise<IGame[]> {
        return GAMESSIMPLE;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return GAMESFREE;
    }

<<<<<<< HEAD
    public async addSimpleGame(newGame: IGame): Promise<IGame>{

        GAMESSIMPLE.push(newGame);
        return(newGame);
    }

    public async addFreeGame(newGame: IGame): Promise<IGame>{
        //Not implemented for sprint1
        GAMESFREE.push(newGame);//mock-data for sprint1 
=======
    public async addSimpleGame(newGame: IGame): Promise<IGame> {
        GAMES.push(newGame);

        return(newGame);
    }

    public async addFreeGame(newGame: IGame): Promise<IGame> {
        GAMES.push(newGame); // mock-data for sprint1

>>>>>>> f21406fdff9f8bc78d8b6964d935e74a7d6173f5
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

        return {title:BASE_ID,body:"Le jeu ${gameName} a été supprimer"};;
    }

}
