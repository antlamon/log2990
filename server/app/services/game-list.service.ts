
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { IGame, ISolo } from "../../../common/models/game";
import { FREEGAMES, SIMPLEGAMES } from "../mock-games";
import { TYPES } from "../types";
import { ImageService } from "./image.service";
import {SocketsEvents} from "../../../common/communication/socketsEvents";
import {SocketServerManager} from "../socketServerManager"
import { ITop3 } from "../../../common/models/top3";

@injectable()
export class GameListService {
    public constructor( @inject(TYPES.ImageService) private imageService: ImageService,
                        @inject(TYPES.SocketServerManager) private socketController: SocketServerManager) {
        // for sprint1, load the image as string64. Will be changed for a database
        for (const simpleGame of SIMPLEGAMES) {
            simpleGame.imageURL = this.imageService.imageToString64(simpleGame.imageURL);
        }
        for (const freeGame of FREEGAMES) {
            freeGame.imageURL = this.imageService.imageToString64(freeGame.imageURL);
        }
    }

    public async getSimpleGames(): Promise<IGame[]> {
        return SIMPLEGAMES;
    }

    public async getFreeGames(): Promise<IGame[]> {
        return FREEGAMES;
    }

    public async addFreeGame(newGame: IGame): Promise<IGame> {
        // Not implemented for sprint1
        FREEGAMES.push(newGame); // mock-data for sprint1

        return(newGame);
    }
    public async deleteSimpleGame(gameName: string): Promise<Message> {
        const index: number = SIMPLEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas!` };
        }
        SIMPLEGAMES.splice(index, 1);
        this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimer` };
    }
    public async deleteFreeGame(gameName: string): Promise<Message> {
        const index: number = FREEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas` };
        }
        FREEGAMES.splice(index, 1);
        this.socketController.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimer` };
    }

    public async addSimpleGame(newGame: ISolo, originalBuffer: Buffer, modifiedBuffer: Buffer): Promise<Message> {
        const name: string = newGame.name;
        const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
        //for mock-data, will be changed when database is implemented
        if(message.title!=ERROR_ID)
        {
            const game: IGame = {name: message.body, imageURL:"data:image/bmp;base64,"+ originalBuffer.toString("base64"),
            solo: this.top3RandomOrder(), multi:  this.top3RandomOrder() }
            SIMPLEGAMES.push(game);
            this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);
        }
        else
        {
            console.log(message.body);
        }

        return (message);
    }
    public top3RandomOrder(): ITop3 {

        let scores: number[] = [];
        for(let i: number = 0; i < 3; i++) {
            scores.push(this.randomNumberGenerator(500,1000))
        }
        scores.sort();
        return {first: scores[0], second: scores[1], third: scores[2]}
    }
    public randomNumberGenerator(min: number,max: number ): number // min and max included
    {
        return Math.floor(Math.random()*(max-min+1)+min);
    }
}
