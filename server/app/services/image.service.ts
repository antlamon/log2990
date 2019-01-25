import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Pixel, ImageBMP, ConvertImage } from "./convertImage.service";
import Types from "../types";
import { Request, Response } from "express";
import { readFile, readFileSync, writeFileSync } from "fs";

@injectable()
export class ImageService {

    public constructor(@inject(Types.ConvertImage) private convertImage: ConvertImage) {}

    public getDifferentImage(req: Request, res: Response ) {
        
        const path1: string = "./app/documents/image1.bmp";
        const path2: string = "./app/documents/image2.bmp";
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
    }

}
