import { injectable, inject } from "inversify";
import "reflect-metadata";
import { IGame, ISolo } from "../../../common/models/game";
import { GAMES } from "../mock-games";
import { ImageService } from "./image.service";
import { TYPES } from "../types";
import { Message } from "../../../common/communication/message";
import { writeFileSync } from "fs";

@injectable()
export class GameListService {

    public constructor(@inject(TYPES.ImageService) private imageService: ImageService) {}

    public async getSimpleGames(): Promise<IGame[]> {
        return GAMES;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return GAMES;
    }

    public async addSimpleGame(newGame: ISolo, originalBuffer: Buffer, modifiedBuffer: Buffer): Promise<Message> {
        const name: string = newGame.name;
        const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
        writeFileSync("./app/documents/original"+name+".bmp", originalBuffer);
        const game: IGame = {name: message.title, imageURL: "./app/documents/"+ name +".bmp", solo: {first: 1, second: 2,third: 3}, multi:  {first: 1, second: 2,third: 3} }
        GAMES.push(game);
        return(message);
    }

    public async addFreeGame(newGame: IGame): Promise<IGame> {
        GAMES.push(newGame); // mock-data for sprint1
        return(newGame);
    }

}
