import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Point } from "../../../common/communication/message";
import { IdentificationServiceManager } from "../services/identification.service.manager";
import { TYPES } from "../types";

@injectable()
export class IdentificationController {

    public static readonly URL: string = "/api/identification";

    public constructor(@inject(TYPES.IdentificationServiceManager) private identificationServiceManager: IdentificationServiceManager) {}

    public get router(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const gameId: string = req.body.gameId;
            const point: Point = req.body.point;
            res.json(this.identificationServiceManager.getDifference(gameId, point));
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const gameId: string = req.body.gameId;
            const originalImagePath: string = req.body.originalImagePath;
            const modifiedImagePath: string = req.body.modifiedImagePath;
            const differenceImagePath: string = req.body.differenceImagePath;
            res.json(this.identificationServiceManager.startNewService(gameId, originalImagePath, modifiedImagePath, differenceImagePath));
        });

        return router;
    }
}
