import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Message } from "../../../common/communication/message";
import { GameMessageService} from "../services/game-message.service";
import { TYPES } from "../types";
import { IGameMessage } from "../../../common/models/simpleGameMessage";

@injectable()
export class GameMessageController {

    private upload: RequestHandler;
    public readonly URL: string = "/api/gameMessage";

    public constructor(@inject(TYPES.GameMessageService) private gameMessageService: GameMessageService) {

    }

    public get router(): Router {
        const router: Router = Router();

        router.post("/message", this.upload, (req: Request, res: Response, next: NextFunction) => {

            this.gameMessageService.sendMessage(req.body).then(
                (response: Message) => {
                    res.json(response);
                },
                (error: Error) => {
                    res.json(error);
                });

        });

        router.get("/message", (req: Request, res: Response, next: NextFunction) => {
            this.gameMessageService.getMessages().then(
                (messages: IGameMessage[]) => {
                    res.json(messages);
                },
                (error: Error) => {
                    res.json(error);
                });
        });

        return router;
    }
}