import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IGame } from "../../../common/models/game";
import { GAMES } from "../mock-games";
import { ImageService } from "./image.service";
import { TYPES } from "../types";

@injectable()
export class GameListService {

    public constructor(@inject(TYPES.ImageService)private imageService: ImageService){

    }

    public async getSimpleGames(): Promise<IGame[]> {
        for(let i:number=0; i < GAMES.length;i++)
        {
              GAMES[i].imageURL =  this.imageService.imageToString64("./app/documents/image_wrongformat.bmp");
        }
        return GAMES;
    }

    public deleteSimpleGame(game: IGame): void {
        var index = GAMES.findIndex(i => i.name === game.name); 
        if (index !== -1) {
            GAMES.splice(index, 1);
        } 
        
    }

    public async getFreeGames(): Promise<IGame[]> {
        for(let i:number=0; i < GAMES.length;i++)
        {
              GAMES[i].imageURL =  this.imageService.imageToString64("./app/documents/image_wrongformat.bmp");
        }
        return GAMES;
    }

    public async addSimpleGame(newGame: IGame): Promise<IGame>{

        GAMES.push(newGame);
        return(newGame);
    }

    public async addFreeGame(newGame: IGame): Promise<IGame>{
        GAMES.push(newGame);//mock-data for sprint1 
        return(newGame);
    }

}
