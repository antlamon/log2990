import { writeFileSync } from "fs";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import { ImageBMP, ImageServiceInterface, Pixel } from "../interfaces";
import { TYPES } from "../types";
import { ConvertImage } from "./convertImage.service";

@injectable()
export class ImageService implements ImageServiceInterface {

    public constructor(@inject(TYPES.ConvertImageServiceInterface) private convertImage: ConvertImage) { }

    public getDifferentImage(newImageName: string, originalBuffer: Buffer, modifiedBuffer: Buffer): Message {
        

        try {
            const image1: ImageBMP = this.convertImage.bufferToImageBMP(originalBuffer);
            const image2: ImageBMP = this.convertImage.bufferToImageBMP(modifiedBuffer);
            const imagesCompared: ImageBMP = this.compareData(image1, image2);
            this.convertImage.imageBMPtoBuffer(imagesCompared, originalBuffer);
            writeFileSync(`./app/documents/${newImageName}.bmp`, originalBuffer);

            return {
                title: "Images compared",
                body: "success",
            };

        } catch (error) {
            return {
                title: "Images compared",
                body: error,
            };
        }
    }

    public compareData(image1: ImageBMP, image2: ImageBMP): ImageBMP {
        const imageCompared: ImageBMP = image1;
        const pixels: Pixel[][] = [];
        const differentPixels: [number, number][] = [];
        if (image1.height !== image2.height || image1.width !== image2.width || image1.height !== 480 || image1.width !== 640) {
            throw Error("La taille des deux images n'est pas la bonne");
        }
        for (let i: number = 0; i < image1.height; i++) {
            pixels[i] = [];
            for (let j: number = 0; j < image1.width; j++) {
                pixels[i][j] = this.substractPixel(image1.pixels[i][j], image2.pixels[i][j]);

                if (this.isBlackPixel(pixels[i][j])) {
                    pixels[i][j] = { red: 255, green: 255, blue: 255 };
                } else {
                    pixels[i][j] = { red: 0, green: 0, blue: 0 };
                    differentPixels.push([i, j]);
                }
            }
        }
        imageCompared.pixels = pixels;
        this.enlargeBlackPixels(imageCompared, differentPixels);

        return imageCompared;
    }

    public enlargeBlackPixels(image: ImageBMP, pixelsToEnlarge: [number, number][]): void {
        pixelsToEnlarge.forEach((element: [number, number]) => {
            const i: number = element[0];
            const j: number = element[1];
            for (let y: number = -3; y <= 3; y++) {
                if (i + y >= 0 && i + y < image.height) {
                    for (let x: number = -3; x <= 3; x++) {
                        if (Math.abs(x) + Math.abs(y) <= 4 && i + x >= 0 && i + x < image.width) {
                            image.pixels[i + y][j + x] = { red: 0, green: 0, blue: 0 };
                        }
                    }
                }
            }
        });
    }

    public substractPixel(pixel1: Pixel, pixel2: Pixel): Pixel {
        return {
            red: pixel1.red - pixel2.red,
            green: pixel1.green - pixel2.green,
            blue: pixel1.blue - pixel2.blue,
        } as Pixel;
    }

    public comparePixel(pixel1: Pixel, pixel2: Pixel): boolean {

        return pixel1.red === pixel2.red && pixel1.blue === pixel2.blue && pixel1.green === pixel2.green;

    }

    public isBlackPixel(pixel: Pixel): boolean {
        return (pixel.blue === 0 && pixel.green === 0 && pixel.red === 0);
    }

}
