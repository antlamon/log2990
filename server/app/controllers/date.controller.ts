import { TYPES } from "../types";
import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import { DateService } from "../services/date.service";
import { DateControllerInterface } from "../interfaces";


@injectable()
export class DateController implements DateControllerInterface {

    public constructor(@inject(TYPES.DateServiceInterface) private dateService: DateService) { }

    public get router(): Router {
        const router: Router = Router();
        router.get("/",
            (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.dateService.currentTime().then(time => {
                    res.json(time);
                });
            });
        return router;
    }
}
