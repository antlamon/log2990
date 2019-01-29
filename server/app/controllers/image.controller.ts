import { inject, injectable } from "inversify";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";
import { Router, Request, Response, NextFunction } from "express";
import { ImageControllerInterface } from "../interfaces";

@injectable()
export class ImageController implements ImageControllerInterface {

    public readonly url: string = "/imagegen";

    public constructor(@inject(TYPES.ImageServiceInterface) private imageService: ImageService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/",
            (req: Request, res: Response, next: NextFunction) => {
                const message = this.imageService.getDifferentImage(req, res);
                res.json(message);
            });
        return router;
    }
}
