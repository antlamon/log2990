import { inject, injectable } from "inversify";
import { Collection, WriteOpResult } from "mongodb";
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
    private readonly SIMPLE_COLLECTION: string = "simple-games";
    private readonly FREE_COLLECTION: string = "free-games";
    private _simpleCollection: Collection;
    private _freeCollection: Collection;

    public constructor(@inject(TYPES.DatabaseClient) private databaseClient: DatabaseClient) {
    }

    public async resetBestScore(gameType: string, id: string): Promise<boolean> {
        // get le jeu
        if (gameType === this.SIMPLE_COLLECTION) {
           return this.getSimpleGame(id).then( async (game: IFullGame) => {
                return this.simpleCollection.update(
                    {card: {id}}, {$set: {...game, card: {...game.card, id: id, solo: this.top3RandomOrder(),
                                                          multi: this.top3RandomOrder()}}}).then(
                        () => {

                        return true; // todo check if something updated
                    }).catch(); // todo check if something updated
            }).catch(); // todo check if something updated
        }
        if (gameType === this.FREE_COLLECTION) {
            return this.getFreeGame(id).then( async (game: IGame3D) => {
                return this.freeCollection.update(
                     {id}, {$set: {...game,
                                   solo: this.top3RandomOrder(), multi: this.top3RandomOrder()}}).then(
                         () => {

                         return true; // todo check if something updated
                     }).catch(); // catch
             }).catch(); // catch to fix
         }

        return Promise.resolve(false);
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
        tempTop3.push({name: "GoodComputer",  score: this.formatTimeScore(scores[0][0], scores[0][1])});
        tempTop3.push({name: "MediumComputer", score: this.formatTimeScore(scores[1][0], scores[1][1])});
        tempTop3.push({name: "BadComputer", score: this.formatTimeScore(scores[2][0], scores[2][1])});

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
    public async changeHighScore(userName: string, gameType: string,
                                 gameMode: string, id: string, nbMinutes: number, nbSeconds: number):  Promise<boolean> {
        return this.getHighScore(gameType, gameMode, id).then(async (temp: IScore[] | null) => {
            if (temp) {
                const tempTop3: IScore[] = temp as IScore[];
                for (let i: number = 0; i < tempTop3.length; ++i) {
                    if (this.compareScores(nbMinutes, nbSeconds, tempTop3[i].score)) {
                        return this.setHighScore(gameType, gameMode, id, userName, nbMinutes, nbSeconds, i).then(() => {
                            return true;
                        });
                    }
                }
            }

            return false;
        });
    }
    private async setHighScore(gameType: string, gameMode: string,
                               id: string, userName: string, nbMinutes: number, nbSeconds: number, pos: number): Promise<void> {
        if (gameType === this.SIMPLE_COLLECTION) {
             return this.getSimpleGame(id).then( async (game: IFullGame) => {
                 game = this.updateSimpleGameScore(game, gameMode, userName, nbMinutes, nbSeconds, pos);

                 return this.simpleCollection.update({card: {id}}, {$set: {...game}}).then((w: WriteOpResult) => {
                     return;
                 });
             });
        }
        if (gameType === this.FREE_COLLECTION) {
            return this.getFreeGame(id).then( async (game: IGame3D) => {
                game = this.updateFreeGameScore(game, gameMode, userName, nbMinutes, nbSeconds, pos);

                return this.freeCollection.update({id}, {$set: {...game}}).then((w: WriteOpResult) => {
                    return;
                });
            });
       }
    }
    private updateSimpleGameScore(game: IFullGame, gameMode: string, userName: string,
                                  nbMinutes: number, nbSeconds: number, pos: number): IFullGame {
        const newScore: IScore = {name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds)};
        if ( gameMode === "solo") {
            game.card.solo[pos] = newScore;
        }
        if ( gameMode === "multi") {
            game.card.multi[pos] = newScore;
        }

        return game;
    }
    private updateFreeGameScore(game: IGame3D, gameMode: string, userName: string,
                                nbMinutes: number, nbSeconds: number, pos: number): IGame3D {
        const newScore: IScore = {name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds)};
        if ( gameMode === "solo") {
            game.solo[pos] = newScore;
        }
        if ( gameMode === "multi") {
            game.multi[pos] = newScore;
        }

        return game;
    }
    private async getHighScore(gameType: string, gameMode: string, id: string): Promise<IScore[] | null> {
        switch (gameType) {
            case this.SIMPLE_COLLECTION:
                return this.getSimpleGame(id).then((v: IFullGame) => {
                    if (!v) {return null; }
                    switch (gameMode) {
                        case "solo":
                            return v.card.solo;
                        case "multi":
                            return v.card.multi;
                        default:
                            return null;
                    }
                });
            case this.FREE_COLLECTION:
                return this.getFreeGame(id).then((v: IGame3D) => {
                    if (!v) { return null; }
                    switch (gameMode) {
                        case "solo":
                            return v.solo;
                        case "multi":
                            return v.multi;
                        default:
                            return null;
                    }
                });
            default:
                return Promise.resolve(null);
        }
    }
    private compareScores(nbMinutes: number, nbSeconds: number, score: string): boolean {
        const time: string[] = score.split(":");

        return (+time[0] * TimeScoreService.MAX_NB_SECONDS + +time[1] ) > (nbMinutes * TimeScoreService.MAX_NB_SECONDS + nbSeconds);
    }
    private get simpleCollection(): Collection {
        if (this._simpleCollection === null) {
            this._simpleCollection = this.databaseClient.db.collection(this.SIMPLE_COLLECTION);
        }

        return this._simpleCollection;
    }
    private get freeCollection(): Collection {
        if (this._freeCollection === null) {
            this._freeCollection = this.databaseClient.db.collection(this.FREE_COLLECTION);
        }

        return this._freeCollection;
    }
    private getSimpleGame(id: string): Promise<IFullGame | null> {
        return this.simpleCollection.findOne({"card.id": id});
    }
    private getFreeGame(id: string): Promise<IGame3D | null> {
        return this.freeCollection.findOne({"id": id});
    }
 }
