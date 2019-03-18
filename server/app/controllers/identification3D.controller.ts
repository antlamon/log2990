import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Point } from "../../../common/communication/message";
import { Identification3DService } from "../services/identification3D.service";
import { TYPES } from "../types";

@injectable()
export class Identification3DController {

    public static readonly URL: string = "/api/identification3D";

    public constructor(@inject(TYPES.Identification3DService) private identification3DService: Identification3DService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {

            res.json();
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            res.json();
        });

        return router;
    }
}
