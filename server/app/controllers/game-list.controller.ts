import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {GameListService} from "../services/game-list.service";
// import { Message } from "../../../common/communication/message";
import { TYPES } from "../types";

@injectable()
export class GameListController {

    public constructor(@inject(TYPES.GameListService) private gameListService: GameListService) { }

    public get router(): Router {
        const router: Router = Router();
       router.get("/simple", (req: Request, res: Response, next: NextFunction) => {
            return this.gameListService.getSimpleGames();
        });

        router.get("/free",async (req: Request, res: Response, next: NextFunction) => {
            return this.gameListService.getFreeGames();
        });

        return router;
    }
}
