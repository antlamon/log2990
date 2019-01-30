import { Request, Response, Router } from "express";
import { inject, injectable  } from "inversify";
import multer = require("multer");
import { ImageService } from "../services/image.service";
import Types from "../types";

@injectable()
export class ImageController {

    public readonly url: string = "/imagegen";

    public constructor(@inject(Types.ImageService) private imageService: ImageService) { }

    public get router(): Router {

        const router: Router = Router();
        const upload: multer.Instance = multer();
        router.post("/", upload.fields([{name: "originalImage", maxCount: 1}, {name: "modifiedImage", maxCount: 1}]),
                    (req: Request, res: Response) => {
            const buffer1: Buffer = req.files["originalImage"][0].buffer;
            const buffer2: Buffer = req.files["modifiedImage"][0].buffer;
            res.json(this.imageService.getDifferentImage(req.body["name"], buffer1, buffer2));
         });

        return router;
    }
}
