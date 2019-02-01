import { injectable } from "inversify";
import "reflect-metadata";
import { IGame } from "../../../common/models/game";
import { GAMES } from "../mock-games";

@injectable()
export class GameListService {

    public async getSimpleGames(): Promise<IGame[]> {
        return GAMES;
    }

    public async getFreeGames(): Promise<IGame[]> {
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
