import { NextFunction, Request, Response, Router } from "express";
import { injectable } from "inversify";
// import { IdentificationService } from "../services/identification.service";

@injectable()
export class IdentificationController {

    public static readonly URL: string = "/api/identification";

    public get router(): Router {

        const router: Router = Router();

        router.get("/", (req: Request, res: Response, next: NextFunction) => {
            res.json("");
        });

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
            res.json("");
        });

        return router;
    }
}
