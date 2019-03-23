import { inject, injectable } from "inversify";
import { Collection } from "mongodb";
import { FREE_GAME_TYPE, SIMPLE_GAME_TYPE} from "../../../common/communication/message";
import { IFullGame } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { IScore } from "../../../common/models/top3";
import { DatabaseClient } from "../database.client";
import { TYPES } from "../types";

@injectable()
export class TimeScoreService {
    public static readonly MIN_TIME_TOP_3: number = 15;
    public static readonly TEN: number = 10;
    public static readonly MAX_TIME_TOP_3: number = 30;
    public static readonly MAX_NB_SECONDS: number = 60;
    public static readonly INVALID_ID_EXCEPTION: string = "Invalid GameID";
    public static readonly INVALID_GAMEMODE_EXCEPTION: string = "Invalid GameMode";
    public static readonly INVALID_GAMETYPE_EXCEPTION: string = "Invalid GameType";
    private readonly SIMPLE_COLLECTION: string = "simple-games";
    private readonly FREE_COLLECTION: string = "free-games";
    private _simpleCollection: Collection;
    private _freeCollection: Collection;

    public constructor(@inject(TYPES.DatabaseClient) private databaseClient: DatabaseClient) { }

    public async resetBestScore(gameType: string, id: string): Promise<void> {
        if (gameType === SIMPLE_GAME_TYPE) {
            return this.resetSimpleGameScore(id);
        } else if (gameType === FREE_GAME_TYPE) {
            return this.resetFreeGameScore(id);
        } else {
            throw new Error(TimeScoreService.INVALID_GAMETYPE_EXCEPTION);
        }
    }

    public async changeHighScore(userName: string, gameType: string,
                                 gameMode: string, id: string, nbMinutes: number, nbSeconds: number): Promise<boolean> {
        const score: IScore[] = await this.getHighScore(gameType, gameMode, id);
        let highScoreChanged: boolean = false;
        for (let i: number = 0; i < score.length; ++i) {
            if (this.compareScores(nbMinutes, nbSeconds, score[i].score)) {
                await this.setHighScore(gameType, gameMode, id, userName, nbMinutes, nbSeconds, i);
                highScoreChanged = true;
                break;
            }
        }

        return highScoreChanged;
    }

    private async resetSimpleGameScore(id: string): Promise<void> {
        const game: IFullGame | null = await this.getSimpleGame(id);
        if (game) {
            await this.simpleCollection.update(
                { card: { id } }, {
                    $set: {
                        ...game, card: {
                            ...game.card, id: id, solo: this.top3RandomOrder(),
                            multi: this.top3RandomOrder(),
                        },
                    },
                });
        } else {
            throw new Error(TimeScoreService.INVALID_ID_EXCEPTION);
        }
    }

    private async resetFreeGameScore(id: string): Promise<void> {
        const game: IGame3D | null = await this.getFreeGame(id);
        if (game) {
            await this.freeCollection.update(
                { id }, {
                    $set: {
                        ...game,
                        solo: this.top3RandomOrder(), multi: this.top3RandomOrder(),
                    },
                });
        } else {
            throw new Error(TimeScoreService.INVALID_ID_EXCEPTION);
        }
    }

    private top3RandomOrder(): IScore[] {
        const scores: [number, number][] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push([this.randomNumber(TimeScoreService.MIN_TIME_TOP_3, TimeScoreService.MAX_TIME_TOP_3),
                         this.randomNumber(0, TimeScoreService.MAX_NB_SECONDS)]);
        }
        scores.sort((x: [number, number], y: [number, number]) => (x[0] * TimeScoreService.MAX_NB_SECONDS + x[1]) -
            (y[0] * TimeScoreService.MAX_NB_SECONDS + y[1]));
        const tempTop3: IScore[] = [];
        tempTop3.push({ name: "GoodComputer", score: this.formatTimeScore(scores[0][0], scores[0][1]) });
        tempTop3.push({ name: "MediumComputer", score: this.formatTimeScore(scores[1][0], scores[1][1]) });
        tempTop3.push({ name: "BadComputer", score: this.formatTimeScore(scores[2][0], scores[2][1]) });

        return tempTop3;
    }

    private formatTimeScore(nbMinutes: number, nbSeconds: number): string {
        return this.formatTime(nbMinutes) + ":" + this.formatTime(nbSeconds);
    }

    private formatTime(time: number): string {
        return ((time < TimeScoreService.TEN) ? "0" : "") + time.toString();
    }

    private randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min + 1) + min);
    }

    private async setHighScore(gameType: string, gameMode: string,
                               id: string, userName: string, nbMinutes: number, nbSeconds: number, pos: number): Promise<void> {
        if (gameType === SIMPLE_GAME_TYPE) {
            let game: IFullGame | null = await this.getSimpleGame(id);
            if (game) {
                game = this.updateSimpleGameScore(game, gameMode, userName, nbMinutes, nbSeconds, pos);
                await this.simpleCollection.update({ card: { id } }, { $set: { ...game } });
            }
        } else if (gameType === FREE_GAME_TYPE) {
            let game: IGame3D | null = await this.getFreeGame(id);
            if (game) {
                game = this.updateFreeGameScore(game, gameMode, userName, nbMinutes, nbSeconds, pos);
                await this.freeCollection.update({ id }, { $set: { ...game } });
            }
        }
    }

    private updateSimpleGameScore(game: IFullGame, gameMode: string, userName: string,
                                  nbMinutes: number, nbSeconds: number, pos: number): IFullGame {
        const newScore: IScore = { name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds) };
        if (gameMode === "solo") {
            game.card.solo[pos] = newScore;
        } else if (gameMode === "multi") {
            game.card.multi[pos] = newScore;
        }

        return game;
    }

    private updateFreeGameScore(game: IGame3D, gameMode: string, userName: string,
                                nbMinutes: number, nbSeconds: number, pos: number): IGame3D {
        const newScore: IScore = { name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds) };
        if (gameMode === "solo") {
            game.solo[pos] = newScore;
        } else if (gameMode === "multi") {
            game.multi[pos] = newScore;
        }

        return game;
    }

    private async getHighScore(gameType: string, gameMode: string, id: string): Promise<IScore[]> {
        let game: IFullGame | IGame3D | null;
        switch (gameType) {
            case SIMPLE_GAME_TYPE:
                game = await this.getSimpleGame(id);
                if (!game) { throw new Error(TimeScoreService.INVALID_ID_EXCEPTION); }
                switch (gameMode) {
                    case "solo":
                        return game.card.solo;
                    case "multi":
                        return game.card.multi;
                    default:
                        throw new Error(TimeScoreService.INVALID_GAMEMODE_EXCEPTION);
                }
            case FREE_GAME_TYPE:
                game = await this.getFreeGame(id);
                if (!game) { throw new Error(TimeScoreService.INVALID_ID_EXCEPTION); }
                switch (gameMode) {
                    case "solo":
                        return game.solo;
                    case "multi":
                        return game.multi;
                    default:
                        throw new Error(TimeScoreService.INVALID_GAMEMODE_EXCEPTION);
                }
            default:
                throw new Error(TimeScoreService.INVALID_GAMETYPE_EXCEPTION);
        }
    }

    private compareScores(nbMinutes: number, nbSeconds: number, score: string): boolean {
        const time: string[] = score.split(":");

        return (+time[0] * TimeScoreService.MAX_NB_SECONDS + +time[1]) > (nbMinutes * TimeScoreService.MAX_NB_SECONDS + nbSeconds);
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

    private async getSimpleGame(id: string): Promise<IFullGame | null> {
        return this.simpleCollection.findOne({ "card.id": id });
    }

    private async getFreeGame(id: string): Promise<IGame3D | null> {
        return this.freeCollection.findOne({ "id": id });
    }
}
