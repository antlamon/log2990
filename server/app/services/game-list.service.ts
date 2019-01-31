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
        console.log(newGame + "ajouté BRAVO");
        return(newGame);
    }

}
