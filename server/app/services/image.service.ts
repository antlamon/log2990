import { readFileSync, writeFileSync } from "fs";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { Message, BASE_ID, ERROR_ID } from "../../../common/communication/message";
import { TYPES } from "../types";
import { ConvertImage, ImageBMP, Pixel } from "./convertImage.service";
import { PATHS } from "../path";

@injectable()
export class ImageService {

    public static readonly IMAGE_HEIGHT: number = 480;
    public static readonly IMAGE_WIDTH: number = 640;
    public static readonly NUM_DIFF: number = 7;
    public static readonly ENLARGE_LENGHT: number = 3;
    public static readonly ENLARGE_MAX_DIST: number = 4;

    public static readonly ERROR_MESSAGE_NOT_7_ERRORS = "The given images did not have 7 differences";
    public static readonly ERROR_MESSAGE_SIZE_NOT_COMPATIBLE = "The size of the two images are not compatibles";

    public constructor(@inject(TYPES.ConvertImage) private convertImage: ConvertImage) { }

    public getDifferencesImage(newImageName: string, originalBuffer: Buffer, modifiedBuffer: Buffer): Message {
        try {
            const image1: ImageBMP = this.convertImage.bufferToImageBMP(originalBuffer);
            const image2: ImageBMP = this.convertImage.bufferToImageBMP(modifiedBuffer);
            const imagesCompared: ImageBMP = this.compareData(image1, image2);
            if (this.getNbDifferences(imagesCompared) !== ImageService.NUM_DIFF) {
                throw Error(ImageService.ERROR_MESSAGE_NOT_7_ERRORS);
            }
            this.convertImage.imageBMPtoBuffer(imagesCompared, modifiedBuffer);
            writeFileSync(PATHS.DIFFERENCES_IMAGES_PATH + `${newImageName}.bmp`, modifiedBuffer);
            return {
                title: BASE_ID,
                body: newImageName,
            };

        } catch (error) {
            return {
                title: ERROR_ID,
                body: error.message,
            };
        }
    }

    public getNbDifferences(image: ImageBMP): number {
        const pixels: Pixel[][] = image.pixels;
        const visited: boolean[][] = this.createVisitedArray(pixels);
        const callBackPixels: [number, number][] = [];
        let diffCount: number = 0;
        for (let x: number = 0; x < image.height; x++) {
            for (let y: number = 0; y < image.width; y++) {
                if (!visited[x][y]) {
                    diffCount++;
                    callBackPixels.push([x, y]);
                    while (callBackPixels.length > 0) {
                        let hasNext: boolean = false;
                        const current: [number, number]  = callBackPixels[callBackPixels.length - 1];
                        for (let i: number = current[0] - 1; i <= current[0] + 1; i++ ) {
                            for (let j: number = current[1] - 1; j <= current[1] + 1; j++ ) {
                                if (i >= 0 && i < image.height && j >= 0 && j < image.width && !visited[i][j]) {
                                    callBackPixels.push([i, j]);
                                    hasNext = true;
                                    visited[i][j]=true;
                                }
                            }
                        }
                        if (!hasNext) {
                            callBackPixels.pop(); }
                    }
                }
            }
        }
        return diffCount;
    }
    public createVisitedArray(pixels: Pixel[][]):boolean[][]{
        let visited: boolean[][]=[];
        for (let y: number = 0; y<pixels.length; ++y) {
            visited.push(new Array(pixels[0].length).fill(true));
            for (let x: number = 0; x < pixels[0].length; ++x) {
                if(this.isBlackPixel(pixels[y][x])) {
                    visited[y][x]=false;
                }
            }
        }  
        return visited;
    }

    public contains(array: [number, number][], item: [number, number]): boolean {

        for (const element of array) {
             if ( element[0] === item[0] && element[1] === item[1]) {
                return true;
            }
        }

        return false;
    }

    public compareData(image1: ImageBMP, image2: ImageBMP): ImageBMP {
        const imageCompared: ImageBMP = image1;
        const pixels: Pixel[][] = [];
        const differentPixels: [number, number][] = [];
        if (image1.height !== image2.height || image1.width !== image2.width
             || image1.height !== ImageService.IMAGE_HEIGHT || image1.width !== ImageService.IMAGE_WIDTH) {
            throw Error(ImageService.ERROR_MESSAGE_SIZE_NOT_COMPATIBLE);
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
            for (let y: number = -ImageService.ENLARGE_LENGHT; y <= ImageService.ENLARGE_LENGHT; y++) {
                if (i + y >= 0 && i + y < image.height) {
                    for (let x: number = -ImageService.ENLARGE_LENGHT; x <= ImageService.ENLARGE_LENGHT; x++) {
                        if (Math.abs(x) + Math.abs(y) <= ImageService.ENLARGE_MAX_DIST && i + x >= 0 && i + x < image.width) {
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

    public imageToString64(path: string):  string {
        return "data:image/bmp;base64," + readFileSync(path).toString("base64");
    }
}
