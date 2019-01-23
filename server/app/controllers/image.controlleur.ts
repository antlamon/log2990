import { inject, injectable  } from "inversify";
import { ImageService } from "../services/image.service";
import Types from "../types";
import { Router, Request, Response, NextFunction } from "express";

@injectable()
export class ImageController {

    public constructor(@inject(Types.ImageService) private imageService: ImageService) { }

    public get router(): Router {
        const router: Router = Router();

        router.get("/imagegen",
            (req: Request, res: Response, next: NextFunction) => {
                this.imageService.getDifferentImage(req, res);
                });
        return router;
    }
}
