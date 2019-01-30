import { injectable } from "inversify";
import "reflect-metadata";
import {IGame} from "../../../common/models/game";

@injectable()
export class GameListService {
    public readonly fakeGames: IGame[]
        = [ { name: "Nissan Patrol", imageURL: "test.url", solo: {first: 9999, second: 9999, third: 9999}, multi: {first: 9999, second: 9999, third: 9999}}];

    public async getSimpleGames(): Promise<IGame[]> {
        return this.fakeGames;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return this.fakeGames;
    }

}
