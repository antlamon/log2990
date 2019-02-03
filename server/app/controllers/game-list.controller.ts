import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { Message } from "../../../common/communication/message";
import {GameListService} from "../services/game-list.service";
import { TYPES } from "../types";

@injectable()
export class GameListController {

    private upload: RequestHandler;
    public readonly URL: string = "/api/gameList";

    public constructor(@inject(TYPES.GameListService) private gameListService: GameListService) {
        this.upload = multer().fields([
            {
                name: "originalImage", maxCount: 1,
            },
            {
                name: "modifiedImage", maxCount: 1,
            },
        ]);
     }

    public get router(): Router {
        const router: Router = Router();

        router.post("/simple", this.upload, (req: Request, res: Response, next: NextFunction) => {

            console.log(req.body);
            const originalBuffer: Buffer = req.files["originalImage"][0].buffer;

            const modifiedBuffer: Buffer = req.files["modifiedImage"][0].buffer;
            this.gameListService.addSimpleGame(req.body, originalBuffer, modifiedBuffer).then((game) => {
                res.json(game);
            });
        });

        router.delete("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.deleteSimpleGame(req.query.name).then((response: Message) => {
                res.json(response);
            });
        });
        router.delete("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.deleteFreeGame(req.query.name).then((response: Message) => {
                res.json(response);
            });
        });

        router.get("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getSimpleGames().then((simpleGames) => {
               res.json(simpleGames);
            });
        });

        router.get("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getFreeGames().then((freeGames) => {
                res.json(freeGames);
            });
        });

        router.post("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.addFreeGame(req.body).then((game) => {
                res.json(game);
            });
        });

        return router;
    }
}
