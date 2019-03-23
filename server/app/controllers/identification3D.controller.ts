import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { IDifference } from "../../../common/models/game3D";
import { Identification3DServiceManager } from "../microservices/identification3D.service.manager";
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
            const differences: IDifference[] = req.query.differences;
            res.json(this.identification3DManager.startNewService(gameRoomId, differences));
        });

        return router;
    }
}
