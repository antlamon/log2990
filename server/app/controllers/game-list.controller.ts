import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { Message } from "../../../common/communication/message";
import { IGame, IFullGame } from "../../../common/models/game";
import { Game3D } from "../../../common/models/game3D";
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

            this.gameListService.addSimpleGame(req.body, originalFile, modifiedFile).then(
                (game: Message) => {
                    res.json(game);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.post("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.addFreeGame(req.body).then(
                (response: Message) => {
                    res.json(response);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.delete("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.deleteSimpleGame(req.query.id).then(
                (response: Message) => {
                    res.json(response);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.delete("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.deleteFreeGame(req.query.id).then(
                (response: Message) => {
                    res.json(response);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.get("/simple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getSimpleGames().then(
                (simpleGames: IGame[]) => {
                    res.json(simpleGames);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.get("/onesimple", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getSimpleGame(req.query.id).then(
                (simpleGame: IFullGame) => {
                    res.json(simpleGame);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.get("/free", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getFreeGames().then(
                (freeGames: Game3D[]) => {
                    res.json(freeGames);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        return router;
    }
}
