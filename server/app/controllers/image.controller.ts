import { NextFunction, Request, Response, Router } from "express";
import { inject, injectable } from "inversify";
import { Message } from "../../../common/communication/message";
import { ImageControllerInterface } from "../interfaces";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

@injectable()
export class ImageController implements ImageControllerInterface {

    public readonly url: string = "/imagegen";

    public constructor(@inject(TYPES.ImageServiceInterface) private imageService: ImageService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/", (req: Request, res: Response, next: NextFunction) => {
                const message: Message = this.imageService.getDifferentImage(req, res);
                res.json(message);
            });

        return router;
    }
}
