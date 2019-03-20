import { injectable } from "inversify";
import { ITop3 } from "../../../common/models/top3";
import {DatabaseClient} from "";

@injectable()
export class TimeScoreService {
    public static readonly MIN_TIME_TOP_3: number = 15;
    public static readonly TEN: number = 10;
    public static readonly MAX_TIME_TOP_3: number = 30;
    public static readonly MAX_NB_SECONDS: number = 60;

    public resetBestScore(typeGame: string, id: string): Promise<boolean> {
        // get le jeu
        //reset solo et multi si existe
        //else return false
    }
    private top3RandomOrder(): ITop3 {
        const scores: [number, number][] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push([this.randomNumber(TimeScoreService.MIN_TIME_TOP_3, TimeScoreService.MAX_TIME_TOP_3),
                         this.randomNumber(0, TimeScoreService.MAX_NB_SECONDS)]);
        }
        scores.sort((x: [number, number]) => x[0] * TimeScoreService.MAX_NB_SECONDS + x[1]);

        return { first: {name: "GoodComputer", score: scores[0][0].toString() +
        (scores[0][1] < TimeScoreService.TEN) ? ":0" : ":" + scores[0][1].toString()},
                 second: {name: "MediumComputer", score: scores[0][0].toString() +
                 (scores[1][1] < TimeScoreService.TEN) ? ":0" : ":" + scores[1][1].toString()},
                 third: {name: "BadComputer", score: scores[2][0].toString() +
                 (scores[2][1] < TimeScoreService.TEN) ? ":0" : ":" + scores[2][1].toString()},
                };
    }
    private randomNumber(min: number, max: number): number {

        return Math.random() * (max - min + 1) + min;
    }
    public setHighScore(userName: string, gameMode: string, nbMinutes: number, nbSeconds: number): boolean {
        let temp: ITop3 = {first: {name: "a", score: "a"}, second: {name: "a", score: "a"}, third: {name: "a", score: "a"}};
        if (gameMode === "multi") { //todo call database
            temp = {first: {name: "a", score: "a"}, second: {name: "a", score: "a"}, third: {name: "a", score: "a"}};
        }
        else {
            temp = {first: {name: "a", score: "a"}, second: {name: "a", score: "a"}, third: {name: "a", score: "a"}};
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.second.score)) {
            //todo
            return true;
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.second.score)) {
            //todo
            return true;
        }
        if (this.compareScores(nbMinutes, nbSeconds, temp.second.score)) {
            //todo
            return true;
        }

        return false;
    }
    private compareScores(nbMinutes: number, nbSeconds: number, score: string): boolean {
        const time: string[] = score.split(":");

        return (+time[0] * TimeScoreService.MAX_NB_SECONDS + +time[1] ) < (nbMinutes * TimeScoreService.MAX_NB_SECONDS + nbSeconds);
    }
 }
