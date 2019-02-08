import { readFileSync } from "fs";
import { inject } from "inversify";
import { TYPES } from "../types";
import { ConvertImage, ImageBMP } from "./convertImage.service";

export class IdentificationService {
    private originalImage: ImageBMP;
    private modifiedImage: ImageBMP;
    private differencesImage: ImageBMP;

    public constructor( @inject(TYPES.ConvertImage) private convertImage: ConvertImage,
                        originalImagePath: string, modifiedImagePath: string, differencesImagePath: string) {
        this.originalImage = this.convertImage.bufferToImageBMP(readFileSync(originalImagePath));
        this.modifiedImage = this.convertImage.bufferToImageBMP(readFileSync(modifiedImagePath));
        this.differencesImage = this.convertImage.bufferToImageBMP(readFileSync(differencesImagePath));
    }

    public getDifference(x: number, y: number): string {
        if (this.validateDifference(x, y)) {
            this.updateModifiedImage(x, y);

            return this.imageToString64(this.convertImage.imageBMPtoBuffer(this.modifiedImage, Buffer.from([])));
        } else {
            return "";
        }
    }

    private updateModifiedImage(x: number, y: number): void {
        this.modifiedImage = this.originalImage;
    }

    private validateDifference(x: number, y: number): boolean {
        return true;
    }

    private imageToString64(buffer: Buffer): string {
        return "data:image/bmp;base64," + buffer.toString("base64");
    }
}
