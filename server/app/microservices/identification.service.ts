import { Point } from "../../../common/communication/message";
import { ImageBMP } from "./convertImage.service";

export class IdentificationService {
    public constructor(private originalImage: ImageBMP, private modifiedImage: ImageBMP, private differencesImage: ImageBMP) { }

    public getDifference(point: Point): ImageBMP | null {
        if (!this.validateDifference(point)) {
            return null;
        }
        this.updateModifiedImage(point);

        return this.modifiedImage;
    }

    private updateModifiedImage(startingPoint: Point): void {
        const neighbours: Point[] = [];
        const visited: boolean[] = [];
        neighbours.push(startingPoint);
        while (neighbours.length !== 0) {
            const point: Point = neighbours.pop() as Point;
            visited[point.x + point.y * this.originalImage.width] = true;
            this.modifiedImage.pixels[point.y][point.x] = this.originalImage.pixels[point.y][point.x];
            for (let i: number = point.x - 1; i <= point.x + 1; ++i ) {
                for (let j: number = point.y - 1; j <= point.y + 1; ++j) {
                        if (this.isInBounds(i, j) && this.isBlackPixel(i, j) && !this.isVisited(visited, i, j)) {
                            neighbours.push({x: i, y: j});
                        }
                }
            }
        }
    }
    private isInBounds(x: number, y: number): boolean {
        return x >= 0 && y >= 0 && x < this.originalImage.width && y < this.originalImage.height;
    }
    private isVisited(visited: boolean[], x: number, y: number): boolean {
        return visited[x + y * this.originalImage.width];
    }

    private validateDifference(point: Point): boolean {
        return this.isBlackPixel(point.x, point.y) &&
                this.originalImage.pixels[point.y][point.x] !== this.modifiedImage.pixels[point.y][point.x];
    }

    private isBlackPixel(x: number, y: number): boolean {
        return this.differencesImage.pixels[y][x].blue === 0;
    }
}
