import Axios, { AxiosResponse } from "axios";
import FormData = require("form-data");
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { IGame, ISimpleForm } from "../../../common/models/game";
import { ITop3 } from "../../../common/models/top3";
import { FREEGAMES, SIMPLEGAMES } from "../mock-games";
import { SocketServerManager } from "../socketServerManager";
import { TYPES } from "../types";
import { ImageService } from "./image.service";

@injectable()
export class GameListService {
    public static readonly MIN_TIME_TOP_3: number = 500;
    public static readonly MAX_TIME_TOP_3: number = 1000;

    public constructor( @inject(TYPES.ImageService) private imageService: ImageService,
                        @inject(TYPES.SocketServerManager) private socketController: SocketServerManager) {

        // for sprint1, load the image as string64. Will be changed later for a database
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

        return (newGame);
    }

    public async deleteSimpleGame(gameName: string): Promise<Message> {
        const index: number = SIMPLEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas!` };
        }
        SIMPLEGAMES.splice(index, 1);
        this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimé` };
    }

    public async deleteFreeGame(gameName: string): Promise<Message> {
        const index: number = FREEGAMES.findIndex((x: IGame) => x.name === gameName);
        if (index === -1) {
            return { title: ERROR_ID, body: `Le jeu ${gameName} n'existe pas!` };
        }
        FREEGAMES.splice(index, 1);
        this.socketController.emitEvent(SocketsEvents.UPDATE_FREE_GAMES);

        return { title: BASE_ID, body: `Le jeu ${gameName} a été supprimé` };
    }

    public async addSimpleGame(newGame: ISimpleForm, originalImage: MulterFile, modifiedImage: MulterFile): Promise<Message> {
        const form: FormData = new FormData();
        form.append("name", newGame.name);
        form.append("originalImage", originalImage.buffer, originalImage.fileName);
        form.append("modifiedImage", modifiedImage.buffer, modifiedImage.fileName);
        const response: AxiosResponse<Message> = await Axios.post("http://localhost:3000/api/image/generation", form, {
            headers: form.getHeaders(),
        });

        const message: Message = response.data;

        // for mock-data, will be changed when database is implemented
        if (message.title !== ERROR_ID) {
            // for mock-data, will be changed when database is implemented
            const game: IGame = {
                name: message.body,
                imageURL: "data:image/bmp;base64," + originalImage.buffer.toString("base64"),
                solo: this.top3RandomOrder(),
                multi: this.top3RandomOrder(),
            };
            SIMPLEGAMES.push(game);
            this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES);
        } else {
            console.error(message.body);
        }

        return (message);
    }

    public top3RandomOrder(): ITop3 {
        const scores: number[] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push(this.randomNumberGenerator(GameListService.MIN_TIME_TOP_3, GameListService.MAX_TIME_TOP_3));
        }
        scores.sort();

        return { first: scores[0], second: scores[1], third: scores[2] };
    }

    public randomNumberGenerator(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
}

export interface MulterFile {
    buffer: Buffer;
    fileName: string;
}
