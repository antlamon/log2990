import { injectable } from "inversify";
import { INITIAL_OBJECT_SIZE, Objet3D } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";

@injectable()
export class ObjectGeneratorService {

    private readonly MIN_SCALE: number = 0.5;
    private readonly MAX_SCALE: number = 1.5;
    private readonly WHITE: number = 0x000000;
    private readonly BLACK: number = 0xFFFFFF;
    private readonly B0X_LENGHT: number = 300;
    private readonly MAX_ROTATION: number = 360;

    public generateRandom3Dobject(objects: Objet3D[]): Objet3D {
        return {
            type: this.randomShape(),
            color: this.randomInt(this.WHITE, this.BLACK),
            position: this.generatePosition(objects),
            size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size
            rotation: {
                x: this.randomInt(0, this.MAX_ROTATION),
                y: this.randomInt(0, this.MAX_ROTATION),
                z: this.randomInt(0, this.MAX_ROTATION),
            },
        };
    }
    private generatePosition(objects: Objet3D[]): {x: number, y: number, z: number} {
        let position: {x: number, y: number, z: number};
        let valid: boolean;
        do {
            position = {
                x: this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
                y: this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
                z: this.randomInt(-this.B0X_LENGHT, this.B0X_LENGHT),
            };
            valid = true;
            for (const obj of objects) {
                if (Math.pow(obj.position.x - position.x, 2) + Math.pow(position.y - obj.position.y, 2)
                + Math.pow(position.z - obj.position.z, 2)
                < Math.pow( INITIAL_OBJECT_SIZE * this.MAX_SCALE, 2)) {
                valid = false;
                }
            }
        } while (!valid);

        return position;

    }
    private randomShape(): string {
        const index: number = this.randomInt(0, SHAPES_SIZE - 1);

        return Shapes[index];
    }

    public randomInt(min: number, max: number): number {
        return Math.floor(this.randomNumber(min, max));
    }

    private random1Interval(min: number, max: number): number {

        return Math.random() + min;
    }

    private randomNumber(min: number, max: number): number {

        return Math.random() * (max - min + 1) + min;
    }
}