import { inject, injectable } from "inversify";
import { Collection, FindOneOptions } from "mongodb";
import { ITop3 } from "../../../common/models/top3";
import { TYPES } from "../types";
import { DatabaseClient } from "./database.client";

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

    public resetBestScore(gameType: string, id: string): Promise<boolean> {
        // get le jeu
        if (gameType === this.SIMPLE_COLLECTION) {
            return this.simpleCollection.findOneAndUpdate(
                {"card.id": id}, {"card.solo": this.top3RandomOrder(), "card.multi": this.top3RandomOrder()}).then(() => {
                    return true; //todo check if something updated
                });
        }
        if (gameType === this.FREE_COLLECTION) {
            return this.freeCollection.findOneAndUpdate(
                {"id": id}, {"solo": this.top3RandomOrder(), "multi": this.top3RandomOrder()}).then(() => {
                    return true; //todo check if something updated
                });
        }

        return new Promise<boolean>(() => false);
    }
    private top3RandomOrder(): ITop3 {
        const scores: [number, number][] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push([this.randomNumber(TimeScoreService.MIN_TIME_TOP_3, TimeScoreService.MAX_TIME_TOP_3),
                         this.randomNumber(0, TimeScoreService.MAX_NB_SECONDS)]);
        }
        scores.sort((x: [number, number]) => x[0] * TimeScoreService.MAX_NB_SECONDS + x[1]);

        return { first: {name: "GoodComputer",  score: this.formatTimeScore(scores[0][0], scores[0][1])},
                 second: {name: "MediumComputer", score: this.formatTimeScore(scores[1][0], scores[1][1])},
                 third: {name: "BadComputer", score: this.formatTimeScore(scores[2][0], scores[2][1])}};
    }
    private formatTimeScore(nbMinutes: number, nbSeconds: number): string {
        return this.formatTime(nbMinutes) + ":" + this.formatTime(nbSeconds);
    }
    private formatTime(time: number): string {
        return (time < TimeScoreService.TEN) ? "0" : "" + time.toString();
    }
    private randomNumber(min: number, max: number): number {

        return Math.random() * (max - min + 1) + min;
    }
    public async changeHighScore(userName: string, gameType: string,
                                 gameMode: string, id: string, nbMinutes: number, nbSeconds: number):  Promise<boolean> {
        const temp: ITop3 | null = await this.getHighScore(gameType, gameMode, id);
        if (temp === null) {
            return new Promise<boolean>(() => false);
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.first.score)) {
            await this.setHighScore(gameType, gameMode, id, userName, nbMinutes, nbSeconds, "first");

            return true;
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.second.score)) {
            await this.setHighScore(gameType, gameMode, id, userName, nbMinutes, nbSeconds, "second");

            return true;
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.third.score)) {
            await this.setHighScore(gameType, gameMode, id, userName, nbMinutes, nbSeconds, "third");

            return true;
        }

        return false;
    }
    private async setHighScore(gameType: string, gameMode: string,
                               id: string, userName: string, nbMinutes: number, nbSeconds: number, pos: string): Promise<void> {
        let queryUpdate: string = gameMode + "." + pos;
        if (gameType === this.SIMPLE_COLLECTION) {
            queryUpdate = "card." + queryUpdate;
            await this.simpleCollection.findOneAndUpdate(
                {"card.id": id}, {queryUpdate: {name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds)}});
        }
        if (gameType === this.FREE_COLLECTION) {
            await this.freeCollection.findOneAndUpdate(
                {"id": id}, {queryUpdate: {name: userName, score: this.formatTimeScore(nbMinutes, nbSeconds)}});
        }
    }
    private async getHighScore(gameType: string, gameMode: string, id: string): Promise<ITop3 | null> {
        if (gameType === this.SIMPLE_COLLECTION) {
            return this.simpleCollection.findOne({"id": id}, {gameMode: 1} as FindOneOptions);
        } else if (gameType === this.FREE_COLLECTION) {
            return this.freeCollection.findOne({"id": id}, {gameMode: 1} as FindOneOptions);
        } else {
            return new Promise<ITop3 | null>(() => null);
        }
    }
    private compareScores(nbMinutes: number, nbSeconds: number, score: string): boolean {
        const time: string[] = score.split(":");

        return (+time[0] * TimeScoreService.MAX_NB_SECONDS + +time[1] ) < (nbMinutes * TimeScoreService.MAX_NB_SECONDS + nbSeconds);
    }
    private get simpleCollection(): Collection {
        if (this._simpleCollection == null) {
            this._simpleCollection = this.databaseClient.db.collection(this.SIMPLE_COLLECTION);
        }

        return this._simpleCollection;
    }
    private get freeCollection(): Collection {
        if (this._freeCollection == null) {
            this._freeCollection = this.databaseClient.db.collection(this.FREE_COLLECTION);
        }

        return this._freeCollection;
    }
 }
