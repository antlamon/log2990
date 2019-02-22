import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Point } from "../../../common/communication/message";
import { IdentificationServiceManager } from "../services/identification.service.manager";
import { TYPES } from "../types";

@injectable()
export class IdentificationController {

    public static readonly URL: string = "/api/identification";

    public constructor(@inject(TYPES.IdentificationServiceManager) private identificationServiceManager: IdentificationServiceManager) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            const point: Point = req.query.point;
            res.json(this.identificationServiceManager.getDifference(gameRoomId, point));
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const originalImagePath: string = req.body.originalImagePath;
            const modifiedImagePath: string = req.body.modifiedImagePath;
            const differenceImagePath: string = req.body.differenceImagePath;
            const gameRoomId: string = req.body.gameRoomId;
            res.json(this.identificationServiceManager
                .startNewService(gameRoomId, originalImagePath, modifiedImagePath, differenceImagePath));
        });

        router.delete("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            res.json(this.identificationServiceManager.deleteService(gameRoomId));
        });

        return router;
    }
}
