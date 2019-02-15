import { injectable } from "inversify";
import { Objet3D } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";

@injectable()
export class ObjectGeneratorService {

    public generateRandom3Dobject(): Objet3D {
        return {
            type: this.randomShape(),
            color: this.randomInt(0x000000, 0xFFFFFF),
            position: {
                x: this.randomInt(-300, 300),
                y: this.randomInt(-300, 300),
                z: this.randomInt(-300, 300),
            },
            size: this.random1Interval(0.5, 1.5), // scale between 50% and 150% of a reference size
            rotation: {
                x: this.randomInt(0, 360),
                y: this.randomInt(0, 360),
                z: this.randomInt(0, 360)
            }
        };
    }
    private randomShape(): string {
        const index: number = this.randomInt(0, SHAPES_SIZE-1);
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