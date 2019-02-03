import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { Message } from "../../../common/communication/message";
import { IGame } from "../../../common/models/game";
import { GameListService, MulterFile } from "../services/game-list.service";
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

            const originalFile: MulterFile = {
                buffer: req.files["originalImage"][0].buffer,
                fileName: req.files["originalImage"][0].originalname,
            };

            const modifiedFile: MulterFile = {
                buffer: req.files["modifiedImage"][0].buffer,
                fileName: req.files["modifiedImage"][0].originalname,
            };

            this.gameListService.addSimpleGame(req.body, originalFile, modifiedFile).then((game: Message) => {
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
            this.gameListService.getSimpleGames().then((simpleGames: IGame[]) => {
                res.json(simpleGames);
            });
        });

        router.get("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getFreeGames().then((freeGames: IGame[]) => {
                res.json(freeGames);
            });
        });

        router.post("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.addFreeGame(req.body).then((game: IGame) => {
                res.json(game);
            });
        });

        return router;
    }
}
