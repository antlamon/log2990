import Axios, { AxiosError, AxiosResponse } from "axios";
import FormData = require("form-data");
import { inject, injectable } from "inversify";
import { Collection, DeleteWriteOpResultObject, ObjectID } from "mongodb";
import "reflect-metadata";
import { BASE_ID, ERROR_ID, Message, SIMPLE_GAME_TYPE } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { HTTP_ERROR } from "../../../common/models/errors";
import { IFullGame, IGame, IGame3DForm, ISimpleForm } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { DatabaseClient } from "../database.client";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { Game3DGeneratorService } from "./game3DGenerator.service";

@injectable()
export class GameListService {
    public static readonly MIN_TIME_TOP_3: number = 15;
    public static readonly MAX_TIME_TOP_3: number = 30;
    private static readonly BMP_S64_HEADER: string = "data:image/bmp;base64,";
    private readonly SIMPLE_COLLECTION: string = "simple-games";
    private readonly FREE_COLLECTION: string = "free-games";
    private _simpleCollection: Collection;
    private _freeCollection: Collection;

    public constructor(@inject(TYPES.SocketServerManager) private socketController: SocketServerManager,
                       @inject(TYPES.Game3DGeneratorService) private game3DGenerator: Game3DGeneratorService,
                       @inject(TYPES.DatabaseClient) private databaseClient: DatabaseClient) {
    }

    public async getSimpleGames(): Promise<IGame[]> {
        return this.simpleCollection.find({}).project({ _id: 0, card: 1 })
            .map((x: IFullGame) => x.card).toArray();
    }

    public async getSimpleGame(id: string): Promise<IFullGame> {
        return await this.simpleCollection.findOne({ "card.id": id }) as IFullGame;
    }

    public async getFreeGames(): Promise<IGame3D[]> {

        return this.freeCollection.find({}).toArray();
    }

    public async getFreeGame(id: string): Promise<IGame3D> {
        return await this.freeCollection.findOne({ id }) as IGame3D;
    }

    public async deleteSimpleGame(id: string): Promise<Message> {
        return this.simpleCollection.deleteOne({ "card.id": id }).then((res: DeleteWriteOpResultObject) => {
            if (res.deletedCount === 1) {
                this.socketController.emitEvent(SocketsEvents.SIMPLE_GAME_DELETED, id);

                return { title: BASE_ID, body: `Le jeu ${id} a été supprimé!` };
            } else {

                return { title: BASE_ID, body: `Le jeu ${id} n'existe pas!` };
            }
        }).catch((error: Error) => {
            return { title: ERROR_ID, body: error.message };
        });
    }

    public async deleteFreeGame(id: string): Promise<Message> {
        return this.freeCollection.deleteOne({ "id": id }).then((res: DeleteWriteOpResultObject) => {
            if (res.deletedCount === 1) {
                this.socketController.emitEvent(SocketsEvents.FREE_GAME_DELETED, id);

                return { title: BASE_ID, body: `Le jeu ${id} a été supprimé!` };
            } else {

                return { title: BASE_ID, body: `Le jeu ${id} n'existe pas!` };
            }
        }).catch((error: Error) => {
            return { title: ERROR_ID, body: error.message };
        });
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
        if (message.title !== ERROR_ID) {
            const imagesArray: string[] = message.body.split(GameListService.BMP_S64_HEADER);
            const newFullGame: IFullGame = {
                card: {
                    id: (new ObjectID()).toHexString(),
                    name: newGame.name,
                    originalImage: GameListService.BMP_S64_HEADER + imagesArray[1],
                    solo: this.game3DGenerator.top3RandomOrder(),
                    multi: this.game3DGenerator.top3RandomOrder(),
                },
                modifiedImage: GameListService.BMP_S64_HEADER + imagesArray[2],
                differenceImage: GameListService.BMP_S64_HEADER + imagesArray[3],
            };
            this.simpleCollection.insertOne(newFullGame).then(() => {
                this.socketController.emitEvent(SocketsEvents.UPDATE_SIMPLES_GAMES, newFullGame.card);
            }).catch((error: Error) => {
                return { title: ERROR_ID, body: error.message };
            });
        }

        return (message);
    }

    public async addFreeGame(newGame: IGame3DForm): Promise<Message> {
        let gameAdded: IGame3D;
        try {
            gameAdded = this.game3DGenerator.createRandom3DGame(newGame);
        } catch (e) {
            return { title: ERROR_ID, body: e.message };
        }

        return this.freeCollection.insertOne(gameAdded).then(() => {
            this.socketController.emitEvent(SocketsEvents.FREE_GAME_ADDED, gameAdded);

            return { title: " The 3D form sent was correct. ", body: "The 3D game will be created shortly. " };

        }).catch((error: Error) => {
            return { title: ERROR_ID, body: error.message };
        });

    }

    public async resetTimeScore(gameType: string, id: string): Promise<void> {
        await Axios.get("http://localhost:3000/api/timescore/reset", {
            params: {
                gameType,
                id,
            },
        }).catch((axiosError: AxiosError) => {
            if (axiosError.response) {
                throw new HTTP_ERROR(axiosError.response.data.body);
            } else {
                throw new HTTP_ERROR(axiosError.message);
            }
        });
        if (gameType === SIMPLE_GAME_TYPE) {
            const tempGame: IFullGame | null = await this.simpleCollection.findOne({ "card.id": id });
            if (tempGame) {
                this.socketController.emitEvent(
                    SocketsEvents.SCORES_UPDATED, { scoreUpdate: { gameType: gameType,
                                                                   id: id, solo: tempGame.card.solo, multi: tempGame.card.multi }});
            }
        } else {
            const tempGame: IGame3D | null = await this.freeCollection.findOne({ id });
            if (tempGame) {
                this.socketController.emitEvent(
                    SocketsEvents.SCORES_UPDATED, { scoreUpdate: { gameType: gameType,
                                                                   id: id, solo: tempGame.solo, multi: tempGame.multi }});
            }
        }
    }

    private get simpleCollection(): Collection {
        if (!this._simpleCollection) {
            this._simpleCollection = this.databaseClient.db.collection(this.SIMPLE_COLLECTION);
        }

        return this._simpleCollection;
    }
    private get freeCollection(): Collection {
        if (!this._freeCollection) {
            this._freeCollection = this.databaseClient.db.collection(this.FREE_COLLECTION);
        }

        return this._freeCollection;
    }
}

export interface MulterFile {
    buffer: Buffer;
    fileName: string;
}
