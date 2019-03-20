import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Point } from "../../../common/communication/message";
import { IdentificationServiceManager } from "../services/identification.service.manager";
import { TYPES } from "../types";

@injectable()
export class TimescoreController {

    public static readonly URL: string = "/api/identification";

    public constructor(@inject(TYPES.IdentificationServiceManager) private identificationServiceManager: IdentificationServiceManager) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            const point: Point = JSON.parse(req.query.point);
            res.json(this.identificationServiceManager.getDifference(gameRoomId, point));
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            const originalImageString: string = req.body.originalImage;
            const modifiedImageString: string = req.body.modifiedImage;
            const differenceImageString: string = req.body.differenceImage;
            const gameRoomId: string = req.body.gameRoomId;
            res.json(this.identificationServiceManager
                .startNewService(gameRoomId, originalImageString, modifiedImageString, differenceImageString));
        });

        router.delete("/", (req: Request, res: Response, next: NextFunction) => {
            const gameRoomId: string = req.query.gameRoomId;
            res.json(this.identificationServiceManager.deleteService(gameRoomId));
        });

        return router;
    }
}
