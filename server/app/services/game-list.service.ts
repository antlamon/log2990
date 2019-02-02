
import { inject, injectable } from "inversify";
import "reflect-metadata";

import { SIMPLEGAMES,FREEGAMES } from "../mock-games";
import { ImageService } from "./image.service";
import { TYPES } from "../types";
import { Message, ERROR_ID,BASE_ID } from "../../../common/communication/message";
import { IGame, ISolo } from "../../../common/models/game";

import { writeFileSync } from "fs";


@injectable()
export class GameListService {


    public constructor(@inject(TYPES.ImageService)private imageService: ImageService){
        //for sprint1, load the image as string64. Will be changed for a database
        for(let i:number=0; i < SIMPLEGAMES.length;i++)
        {
            SIMPLEGAMES[i].imageURL =  this.imageService.imageToString64(SIMPLEGAMES[i].imageURL);
        }
        for(let i:number=0; i < FREEGAMES.length;i++)
        {
            FREEGAMES[i].imageURL =  this.imageService.imageToString64(FREEGAMES[i].imageURL);
        }
    }
    
    public async getSimpleGames(): Promise<IGame[]> {
        return SIMPLEGAMES;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return FREEGAMES;
    }

    public async addFreeGame(newGame: IGame): Promise<IGame>{
        //Not implemented for sprint1
        FREEGAMES.push(newGame);//mock-data for sprint1 
        return(newGame);
    }
    public async deleteSimpleGame(gameName:string): Promise<Message> {
        const index: number = SIMPLEGAMES.findIndex((x: IGame) => x.name ===gameName);
        if (index === -1) {
            return {title:ERROR_ID,body:`Le jeu ${gameName} n'existe pas!`};
        }
        SIMPLEGAMES.splice(index, 1);

        return {title:BASE_ID,body: `Le jeu ${gameName} a été supprimer`};
    }
    public async deleteFreeGame(gameName:string): Promise<Message> {
        const index: number = FREEGAMES.findIndex((x: IGame) => x.name ===gameName);
        if (index === -1) {
            return {title:ERROR_ID,body:`Le jeu ${gameName} n'existe pas`};
        }
        FREEGAMES.splice(index, 1);

        return {title:BASE_ID,body:`Le jeu ${gameName} a été supprimer`};
    }

    public async addSimpleGame(newGame: ISolo, originalBuffer: Buffer, modifiedBuffer: Buffer): Promise<Message> {
        const name: string = newGame.name;
        const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
        writeFileSync("./app/documents/original"+name+".bmp", originalBuffer);
        const game: IGame = {name: message.title, imageURL: this.imageService.imageToString64("./app/documents/original"+ name +".bmp"),
         solo: {first: 1, second: 2,third: 3}, multi:  {first: 1, second: 2,third: 3} }
        SIMPLEGAMES.push(game);
        return(message);
    }

}
