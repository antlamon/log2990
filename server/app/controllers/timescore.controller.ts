import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { TimeScoreService } from "../services/timescore.service";
import { TYPES } from "../types";

@injectable()
export class TimescoreController {

    public static readonly URL: string = "/api/timescore";

    public constructor(@inject(TYPES.TimeScoreService) private timeScoreService: TimeScoreService) { }

    public get router(): Router {
        const router: Router = Router();

        router.put("/", (req: Request, res: Response, next: NextFunction) => {
            const username: string = req.query.username;
            const gameType: string = req.query.gameType;
            const gameMode: string = req.query.gameMode;
            const id: string = req.query.id;
            const nbMinutes: number = req.query.nbMinutes;
            const nbSeconds: number = req.query.nbSeconds;
            try {
                res.json(this.timeScoreService.changeHighScore(username, gameType, gameMode,
                                                               id, nbMinutes, nbSeconds));
            } catch (e) {
                res.json(e);
            }
        });

        router.get("/reset", (req: Request, res: Response, next: NextFunction) => {
            const gameType: string = req.query.gameType;
            const id: string = req.query.id;
            try {
                res.json(this.timeScoreService.resetBestScore(gameType, id));
            } catch (e) {
                res.json(e);
            }
        });

        return router;
    }
}
