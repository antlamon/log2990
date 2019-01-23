import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ConvertImage } from "./convertImage.service";
import Types from "../types";
import { Request, Response } from "express";

@injectable()
export class ImageService {

    public constructor(@inject(Types.ConvertImage) private convertImage: ConvertImage) {}

    getDifferentImage(req: Request, res: Response ) {

        const image1: ImageData= this.convertImage.convertToImageData(req.body.image1);
        const image2: ImageData= this.convertImage.convertToImageData(req.body.image2);


    }

}
