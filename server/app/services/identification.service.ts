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
            const left: Point = { x: point.x - 1, y: point.y };
            const right: Point = { x: point.x + 1, y: point.y };
            const up: Point = { x: point.x, y: point.y + 1 };
            const down: Point = { x: point.x, y: point.y - 1 };
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
        return visited[point.x + point.y * this.originalImage.width];
    }

    private validateDifference(point: Point): boolean {
        return this.isBlackPixel(point) && this.originalImage.pixels[point.y][point.x] !== this.modifiedImage.pixels[point.y][point.x];
    }

    private isBlackPixel(point: Point): boolean {
        return this.differencesImage.pixels[point.y][point.x].blue === 0;
    }
}
