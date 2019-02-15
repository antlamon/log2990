import { readFileSync } from "fs";
import { inject } from "inversify";
import { Point } from "../../../common/communication/message";
import { TYPES } from "../types";
import { ConvertImage, ImageBMP } from "./convertImage.service";

export class IdentificationService {
    private originalImage: ImageBMP;
    private modifiedImage: ImageBMP;
    private differencesImage: ImageBMP;
    private imageBuffer: Buffer;

    public constructor( @inject(TYPES.ConvertImage) private convertImage: ConvertImage,
                        originalImagePath: string, modifiedImagePath: string, differencesImagePath: string) {
        this.originalImage = this.convertImage.bufferToImageBMP(readFileSync(originalImagePath));
        this.imageBuffer = readFileSync(modifiedImagePath);
        this.modifiedImage = this.convertImage.bufferToImageBMP(this.imageBuffer);
        this.differencesImage = this.convertImage.bufferToImageBMP(readFileSync(differencesImagePath));
    }

    public getDifference(point: Point): string {
        if (this.validateDifference(point)) {
            this.updateModifiedImage(point);

            return this.imageToString64(this.convertImage.imageBMPtoBuffer(this.modifiedImage, this.imageBuffer));
        } else {
            return "";
        }
    }

    private updateModifiedImage(startingPoint: Point): void {
        const neighbours: Point[] = [];
        const visited: boolean[] = [];
        neighbours.push(startingPoint);
        while (neighbours.length !== 0) {
            const point: Point = neighbours.pop() as Point;
            visited[point.x + point.y * this.originalImage.width] = true;
            this.modifiedImage.pixels[point.y][point.x] = this.originalImage.pixels[point.y][point.x];
            const left: Point = {x: point.x - 1, y: point.y};
            const right: Point = {x: point.x + 1, y: point.y};
            const up: Point = {x: point.x, y: point.y + 1};
            const down: Point = {x: point.x, y: point.y - 1};
            if (left.x >= 0 && this.isBlackPixel(left) && !this.isVisited(visited, left)) {
                neighbours.push(left);
            }
            if (right.x < this.originalImage.width && this.isBlackPixel(right) && !this.isVisited(visited, right)) {
                neighbours.push(right);
            }
            if (down.y >= 0 && this.isBlackPixel(down) && !this.isVisited(visited, down)) {
                neighbours.push(down);
            }
            if (up.y < this.originalImage.height && this.isBlackPixel(up) && !this.isVisited(visited, up)) {
                neighbours.push(up);
            }
        }
    }

    private isVisited(visited: boolean[], point: Point): boolean {
        return visited[point.x + point.y * this.originalImage.width] === true;
    }

    private validateDifference(point: Point): boolean {
        return this.isBlackPixel(point) && this.originalImage.pixels[point.y][point.x] !== this.modifiedImage.pixels[point.y][point.x];
    }

    private isBlackPixel(point: Point): boolean {
        return this.differencesImage.pixels[point.y][point.x].blue === 0;
    }

    private imageToString64(buffer: Buffer): string {
        return "data:image/bmp;base64," + buffer.toString("base64");
    }
}
