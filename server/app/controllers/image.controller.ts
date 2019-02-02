import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { Message } from "../../../common/communication/message";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

@injectable()
export class ImageController {

    public readonly url: string = "/api/gamelist/smple";
    private upload: RequestHandler;

    public constructor(@inject(TYPES.ImageService) private imageService: ImageService) {
        this.upload = multer().fields([
            {
                name: "originalImage", maxCount: 1,
            },
            {
                name: "modifiedImage", maxCount: 1,
            },
        ]);
    }

    public get router(): Router {

        const router: Router = Router();

        router.post("/", this.upload, (req: Request, res: Response, next: NextFunction) => {
            const name: string = req.body["name"];
            const originalBuffer: Buffer = req.files["originalImage"][0].buffer;
            const modifiedBuffer: Buffer = req.files["modifiedImage"][0].buffer;
            const message: Message = this.imageService.getDifferentImage(name, originalBuffer, modifiedBuffer);
            res.json(message);
        });

        return router;
    }
}
