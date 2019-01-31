import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Message } from "../../../common/communication/message";
import { DateService } from "../services/date.service";
import { TYPES } from "../types";

@injectable()
export class DateController implements DateControllerInterface {

    public constructor(@inject(TYPES.DateService) private dateService: DateService) { }

    public get router(): Router {
        const router: Router = Router();
        router.get("/", (req: Request, res: Response, next: NextFunction) => {
                // Send the request to the service and send the response
                this.dateService.currentTime().then((time: Message) => {
                    res.json(time);
                });
            });

        return router;
    }
}
