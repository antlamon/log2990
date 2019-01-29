import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { TYPES } from "../types";
import { Request, Response } from "express";
import { readFileSync, writeFileSync } from "fs";
import { ImageServiceInterface, Pixel, ImageBMP } from "../interfaces";
import { ConvertImage } from "./convertImage.service";

@injectable()
export class ImageService implements ImageServiceInterface {

    public constructor(@inject(TYPES.ConvertImageServiceInterface) private convertImage: ConvertImage) { }

    public getDifferentImage(req: Request, res: Response): Message {
        const path1: string = "./app/documents/gros1.bmp";
        const path2: string = "./app/documents/gros2.bmp";
        let bufferImage: Buffer = readFileSync(path1);
        const image1: ImageBMP = this.convertImage.bufferToImageBMP(bufferImage);
        const image2: ImageBMP = this.convertImage.bufferToImageBMP(readFileSync(path2));
        console.log("imageCompared");
        let imagedCompared: ImageBMP = this.compareData(image1, image2);
        console.log("imageCompared");
        this.convertImage.imageBMPtoBuffer(imagedCompared, bufferImage);
        writeFileSync("./app/documents/result.bmp", bufferImage);
        return {
            title: "imagedCompared",
            body: ""
        }
    }

    private compareData(image1: ImageBMP, image2: ImageBMP): ImageBMP {
        let imageCompared: ImageBMP = image1;
        let pixels: Pixel[][] = [];
        let differentPixels: [number, number][] = [];

        for (let i = 0; i < image1.height; i++) {
            pixels[i] = [];
            for (let j = 0; j < image1.width; j++) {
                pixels[i][j] = this.comparePixel(image1.pixels[i][j], image2.pixels[i][j]);

                if (this.isBlackPixel(pixels[i][j]))
                    pixels[i][j] = { red: 255, green: 255, blue: 255 };
                else {
                    pixels[i][j] = { red: 0, green: 0, blue: 0 };
                    differentPixels.push([i,j]);
                }
            }
        }
        imageCompared.pixels = pixels;
        this.enlargeBlackPixels(imageCompared, differentPixels);
        return imageCompared;
    }

    private enlargeBlackPixels(image: ImageBMP, pixelsToEnlarge: [number, number][]): void {
        pixelsToEnlarge.forEach(element => {
            const i: number = element[0];
            const j: number = element[1];
            for (let y: number = -3; y <= 3; y++) {
                if (i + y >= 0 && i + y < image.height) {
                    for (let x: number = -3; x <= 3; x++) {
                        if (Math.abs(x) + Math.abs(y) <= 4 && i + x >= 0 && i + x < image.width)
                            image.pixels[i + y][j + x] = { red: 0, green: 0, blue: 0 };
                    }
                }
            }
        });
    }

    private comparePixel(pixel1: Pixel, pixel2: Pixel): Pixel {
        return {
            red: pixel1.red - pixel2.red,
            green: pixel1.green - pixel2.green,
            blue: pixel1.blue - pixel2.blue
        } as Pixel
    }

    private isBlackPixel(pixel: Pixel): boolean {
        return (pixel.blue === 0 && pixel.green === 0 && pixel.red === 0);
    }

}
