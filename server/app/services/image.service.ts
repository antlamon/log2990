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
        
        const path1: string = "./app/documents/gros1.bmp";
        const path2: string = "./app/documents/gros2.bmp";
        const image1: ImageBMP= this.convertImage.bufferToImageBMP(readFileSync(path1));
        const image2: ImageBMP= this.convertImage.bufferToImageBMP(readFileSync(path2));
        console.log("imagedCompared");
        let imagedCompared: ImageBMP = this.compareData(image1, image2);
        console.log("imagedCompared");
        let bufferSortie = readFileSync(path1);
        this.convertImage.imageBMPtoBuffer(imagedCompared,bufferSortie);
        writeFileSync("./app/documents/result.bmp",bufferSortie);
        res.json(imagedCompared);
    }
    
    compareData(image1:ImageBMP, image2:ImageBMP):ImageBMP {

        let imageCompared: ImageBMP = image1;
        for(let i =0; i < image1.height; i++) {
            for(let j=0; j < image1.width; j++) {

                //imageCompared.pixels[i][j] = {red: 255,green:255, blue: 255};
                imageCompared.pixels[i][j] = this.comparePixel(image1.pixels[i][j],image2.pixels[i][j]);

                if(this.isBlackPixel(imageCompared.pixels[i][j])) 
                    imageCompared.pixels[i][j] = {red: 255,green:255, blue: 255};
                else
                {
                    for(let x:number = -3; x<= 3; x++) {
                        for(let y:number =-3; y<= 3; y++) {

                            if(Math.abs(x)+Math.abs(y) <= 4 && i+x >= 0 && i+x < image1.height && i+y >= 0 && i+y < image1.width)
                                imageCompared.pixels[i+x][j+y] = {red: 0, green: 0, blue: 0};
                        }
                    }
                }
            }
        }
        return imageCompared;

    }
    comparePixel(pixel1: Pixel, pixel2: Pixel): Pixel {

        return {
            red: pixel1.red - pixel2.red,
            green: pixel1.green - pixel2.green,
            blue: pixel1.blue - pixel2.blue
        } as Pixel
    }
    isBlackPixel(pixel: Pixel): boolean {

        return (pixel.blue === 0 && pixel.green === 0 && pixel.red === 0);
    }

}
