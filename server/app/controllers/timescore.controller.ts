import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { TimeScoreService } from "../microservices/timescore.service";
import { TYPES } from "../types";
import { BASE_ID, ERROR_ID } from "../../../common/communication/message";

@injectable()
export class TimescoreController {

    public static readonly URL: string = "/api/timescore";
    private static readonly INVALID_PARAM: number = 401;

    public constructor(@inject(TYPES.TimeScoreService) private timeScoreService: TimeScoreService) { }

    public get router(): Router {
        const router: Router = Router();

        router.put("/", async (req: Request, res: Response, next: NextFunction) => {
            const username: string = req.query.username;
            const gameType: string = req.query.gameType;
            const gameMode: string = req.query.gameMode;
            const id: string = req.query.id;
            const nbMinutes: number = req.query.nbMinutes;
            const nbSeconds: number = req.query.nbSeconds;
            try {
                res.json({
                    title: BASE_ID,
                    body: await this.timeScoreService.changeHighScore(username, gameType, gameMode,
                                                                      id, nbMinutes, nbSeconds),
                });
            } catch (e) {
                res.status(TimescoreController.INVALID_PARAM);
                res.json({
                    title: ERROR_ID,
                    body: e,
                });
            }
        });

        router.get("/reset", async (req: Request, res: Response, next: NextFunction) => {
            const gameType: string = req.query.gameType;
            const id: string = req.query.id;
            try {
                res.json(await this.timeScoreService.resetBestScore(gameType, id));
            } catch (e) {
                res.status(TimescoreController.INVALID_PARAM);
                res.json({
                    title: ERROR_ID,
                    body: e,
                });
            }
        });

        return router;
    }
}
