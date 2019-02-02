
import { writeFileSync } from "fs";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { IGame, ISolo } from "../../../common/models/game";
import { FREEGAMES, SIMPLEGAMES } from "../mock-games";
import { SocketServerManager } from "../socketServerManager";
import { TYPES } from "../types";
import { ImageService } from "./image.service";

@injectable()
export class GameListService {
    public constructor( @inject(TYPES.ImageService) private imageService: ImageService,
                        @inject(TYPES.SocketServerManager) private socketServer: SocketServerManager) {
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
        this.socketServer.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return (newGame);
    }
    public async deleteSimpleGame(gameName: string): Promise<Message> {
        const index: number = SIMPLEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas!` };
        }
        SIMPLEGAMES.splice(index, 1);
        this.socketServer.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimer` };
    }
    public async deleteFreeGame(gameName: string): Promise<Message> {
        const index: number = FREEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas` };
        }
        FREEGAMES.splice(index, 1);
        this.socketServer.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimer` };
    }

    public async addSimpleGame(newGame: ISolo, originalBuffer: Buffer, modifiedBuffer: Buffer): Promise<Message> {
        const name: string = newGame.name;
        const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
        writeFileSync("./app/documents/original" + name + ".bmp", originalBuffer);
        const game: IGame = {
            name: message.title,
            imageURL: "./app/documents/" + name + ".bmp",
            solo: { first: 1, second: 2, third: 3 },
            multi: { first: 1, second: 2, third: 3 },
        };
        SIMPLEGAMES.push(game);
        this.socketServer.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

        return(message);
    }

}
