import { Request, Response, Router } from "express";
import { inject, injectable  } from "inversify";
import { ImageService } from "../services/image.service";
import Types from "../types";

@injectable()
export class ImageController {

    public readonly url: string = "/imagegen";

    public constructor(@inject(Types.ImageService) private imageService: ImageService) { }

    public get router(): Router {

        const router: Router = Router();

        router.post("/", (req: Request, res: Response) => { this.imageService.getDifferentImage(req, res); });

        return router;
    }
}
