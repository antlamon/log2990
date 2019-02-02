import { inject, injectable } from "inversify";
import "reflect-metadata";
import { IGame } from "../../../common/models/game";
import { GAMES } from "../mock-games";
import { TYPES } from "../types";
import { ImageService } from "./image.service";

@injectable()
export class GameListService {

    public constructor(@inject(TYPES.ImageService) private imageService: ImageService) {
        for (const game of GAMES) {
              game.imageURL =  this.imageService.imageToString64(game.imageURL);
        }
    }

    public async getSimpleGames(): Promise<IGame[]> {
        return GAMES;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return GAMES;
    }

    public async addSimpleGame(newGame: IGame): Promise<IGame> {
        GAMES.push(newGame);

        return(newGame);
    }

    public async addFreeGame(newGame: IGame): Promise<IGame> {
        GAMES.push(newGame); // mock-data for sprint1

        return(newGame);
    }

}
