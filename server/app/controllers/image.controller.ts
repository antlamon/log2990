import { NextFunction, Request, RequestHandler, Response, Router } from "express";
import { inject, injectable } from "inversify";
import * as multer from "multer";
import { ERROR_ID, Message } from "../../../common/communication/message";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

const HTTP_BADREQUEST: number = 400;

@injectable()
export class ImageController {

    public static readonly URL: string = "/api/image/generation";
    public static readonly NAME_PARAMETER_ERROR: string = "Le paramètre du nom ne doit pas être vide";
    public static readonly INVALID_PARAMETERS_ERROR: string = "Les paramètres de la requete sont absents ou invalides";
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
            let message: Message;
            try {
                const name: string = req.body["name"];
                const originalBuffer: Buffer = req.files["originalImage"][0].buffer;
                const modifiedBuffer: Buffer = req.files["modifiedImage"][0].buffer;
                if (name) {
                    message = this.imageService.getDifferencesImage(name, originalBuffer, modifiedBuffer);
                } else {
                    res.status(HTTP_BADREQUEST);
                    message = {
                        title: ERROR_ID,
                        body: ImageController.NAME_PARAMETER_ERROR,
                    };
                }
            } catch (error) {
                res.status(HTTP_BADREQUEST);
                message = {
                    title: ERROR_ID,
                    body: ImageController.INVALID_PARAMETERS_ERROR,
                };
            }
            res.json(message);
        });

        return router;
    }
}
