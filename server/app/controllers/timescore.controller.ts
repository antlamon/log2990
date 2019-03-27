import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { BASE_ID, ERROR_ID } from "../../../common/communication/message";
import { INVALID_GAMEMODE_ERROR, INVALID_GAMETYPE_ERROR, INVALID_ID_ERROR } from "../../../common/models/errors";
import { TimeScoreService } from "../microservices/timescore.service";
import { TYPES } from "../types";

@injectable()
export class TimescoreController {

    public static readonly URL: string = "/api/timescore";
    private static readonly INVALID_PARAM: number = 422;

    public constructor(@inject(TYPES.TimeScoreService) private timeScoreService: TimeScoreService) { }

    public get router(): Router {
        const router: Router = Router();

        router.put("/", async (req: Request, res: Response, next: NextFunction) => {
            const username: string = req.body.username;
            const gameType: string = req.body.gameType;
            const gameMode: string = req.body.gameMode;
            const id: string = req.body.id;
            const nbMinutes: number = +req.body.nbMinutes;
            const nbSeconds: number = +req.body.nbSeconds;
            try {
                res.json({
                    title: BASE_ID,
                    body: await this.timeScoreService.changeHighScore(username, gameType, gameMode,
                                                                      id, nbMinutes, nbSeconds),
                });
            } catch (e) {
                if (e instanceof INVALID_GAMEMODE_ERROR || e instanceof INVALID_GAMETYPE_ERROR || e instanceof INVALID_ID_ERROR) {

                    res.status(TimescoreController.INVALID_PARAM);
                    res.json({
                        title: ERROR_ID,
                        body: e,
                    });
                }
                throw e;
            }
        });

        router.get("/reset", async (req: Request, res: Response, next: NextFunction) => {
            const gameType: string = req.query.gameType;
            const id: string = req.query.id;
            try {
                res.json(await this.timeScoreService.resetBestScore(gameType, id));
            } catch (e) {
                if (e instanceof INVALID_GAMETYPE_ERROR || e instanceof INVALID_ID_ERROR) {
                    res.status(TimescoreController.INVALID_PARAM);
                    res.json({
                        title: ERROR_ID,
                        body: e,
                    });
                }
                throw e;
            }
        });

        return router;
    }
}
