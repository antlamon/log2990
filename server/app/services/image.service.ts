import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ConvertImage } from "./convertImage.service";
import Types from "../types";
import { Request, Response } from "express";
import * as fs from "fs"

@injectable()
export class ImageService {

    public constructor(@inject(Types.ConvertImage) private convertImage: ConvertImage) {}

    getDifferentImage(req: Request, res: Response ) {
        const bmp1: Buffer = fs.readFileSync("../images/1.bmp");
        const bmp2: Buffer = fs.readFileSync("../images/2.bmp");

        const image1: ImageData = this.convertImage.convertToImageData(bmp1);
        const image2: ImageData = this.convertImage.convertToImageData(bmp2);
    }

}
