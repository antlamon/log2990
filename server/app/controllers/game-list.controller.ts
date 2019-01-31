import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import {GameListService} from "../services/game-list.service";
import { TYPES } from "../types";

@injectable()
export class GameListController {

    public constructor(@inject(TYPES.GameListService) private gameListService: GameListService) { }

    public get router(): Router {
        const router: Router = Router();

        router.post("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.addSimpleGame(req.body).then((game)=>{
                res.json(game);
             });
        });

       router.get("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getSimpleGames().then((simpleGames)=>{
               res.json(simpleGames);
            });
        });

        router.get("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getFreeGames().then((freeGames)=>{
                res.json(freeGames);
            });
        });

        return router;
    }
}
