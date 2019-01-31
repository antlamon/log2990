import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {GameListService} from "../services/game-list.service";
 import { Message } from "../../../common/communication/message";
import { TYPES } from "../types";

@injectable()
export class GameListController {

    public constructor(@inject(TYPES.GameListService) private gameListService: GameListService) { }

    public get router(): Router {
        const router: Router = Router();
       router.get("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getSimpleGames().then((simpleGames)=>{
               res.json(simpleGames);
            });
        });

        router.get("/free",async (req: Request, res: Response, next: NextFunction) => {
            res.json(this.gameListService.getFreeGames());
        });

        return router;
    }
}
