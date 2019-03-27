import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { ERROR_ID, Message } from "../../../common/communication/message";
import { HTTP_ERROR } from "../../../common/models/errors";
import { IFullGame, IGame } from "../../../common/models/game";
import { IGame3D } from "../../../common/models/game3D";
import { GameListService, MulterFile } from "../services/game-list.service";
import { TYPES } from "../types";

@injectable()
export class GameListController {

    private static readonly INVALID_PARAM: number = 422;
    public readonly URL: string = "/api/gameList";
    private upload: RequestHandler;

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
                (freeGames: IGame3D[]) => {
                    res.json(freeGames);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.get("/onefree", (req: Request, res: Response, next: NextFunction) => {
            this.gameListService.getFreeGame(req.query.id).then(
                (freeGame: IGame3D) => {
                    res.json(freeGame);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        router.get("/reset", async (req: Request, res: Response, next: NextFunction) => {
            const gameType: string = req.query.gameType;
            const id: string = req.query.id;
            try {
                res.json(await this.gameListService.resetTimeScore(gameType, id));
            } catch (e) {
                if (e instanceof HTTP_ERROR) {
                    res.status(GameListController.INVALID_PARAM);
                    res.json({
                        title: ERROR_ID,
                        body: e.message,
                    });
                } else {
                    throw e;
                }
            }
        });

        return router;
    }
}
