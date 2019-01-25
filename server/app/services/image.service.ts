import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Pixel, ImageBMP, ConvertImage } from "./convertImage.service";
import Types from "../types";
import { Request, Response } from "express";
<<<<<<< HEAD
import { readFile, readFileSync, writeFileSync } from "fs";
=======
import * as fs from "fs"
>>>>>>> cc53f2cae2c9eec48dd02893f3aafa46d71484d7

@injectable()
export class ImageService {

    public constructor(@inject(Types.ConvertImage) private convertImage: ConvertImage) {}

<<<<<<< HEAD
    public getDifferentImage(req: Request, res: Response ) {
        
        const path1: string = "../documents/image1.bmp";
        const path2: string = "../documents/image2.bmp";
        console.log("hello");
        const image1: ImageBMP= this.convertImage.bufferToImageBMP(readFileSync(path1));
        const image2: ImageBMP= this.convertImage.bufferToImageBMP(readFileSync(path2));

        let imagedCompared: ImageBMP = this.compareData(image1, image2);

        let bufferSortie = readFileSync(path1);
        this.convertImage.imageBMPtoBuffer(imagedCompared,bufferSortie);
        writeFileSync("../documents/result.bmp",bufferSortie);
    }
    
    compareData(image1:ImageBMP, image2:ImageBMP):ImageBMP {

        let imageCompared: ImageBMP = image1;
        for(let i =0; i < image1.height; i++) {
            for(let j=0; j < image1.width; j++) {

                imageCompared.pixels[i][j] = this.comparePixel(image1.pixels[i][j],image2.pixels[i][j]);
                if(imageCompared.pixels[i][j] != {red: 0, green:0, blue: 0})
                    imageCompared.pixels[i][j] = {red: 255,green:255, blue: 255};
            }
        }
        return imageCompared;

    }
    comparePixel(pixel1: Pixel, pixel2: Pixel): Pixel {

        return {
            red: pixel1.red - pixel2.red,
            green: pixel1.green - pixel2.green,
            blue: pixel1.blue - pixel2.blue
        }
=======
    getDifferentImage(req: Request, res: Response ) {
        const bmp1: Buffer = fs.readFileSync("../images/1.bmp");
        const bmp2: Buffer = fs.readFileSync("../images/2.bmp");

        const image1: ImageData = this.convertImage.convertToImageData(bmp1);
        const image2: ImageData = this.convertImage.convertToImageData(bmp2);
>>>>>>> cc53f2cae2c9eec48dd02893f3aafa46d71484d7
    }

}
