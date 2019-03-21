import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { IGame3D } from "../../../common/models/game3D";
import { Identification3DServiceManager } from "../services/identification3D.service.manager";
import { TYPES } from "../types";

@injectable()
export class Identification3DController {

    public static readonly URL: string = "/api/identification3D";

    public constructor(@inject(TYPES.Identification3DServiceManager) private identification3DManager: Identification3DServiceManager) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            const objName: string = req.query.objName;
            res.json(this.identification3DManager.getDifference(gameRoomId, objName));
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            const game: IGame3D = req.query.game;
            res.json(this.identification3DManager.startNewService(gameRoomId, game));
        });

        return router;
    }
}
