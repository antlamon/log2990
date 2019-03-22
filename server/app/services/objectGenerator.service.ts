import { injectable } from "inversify";
import { IModel3D, INITIAL_MODELS_SIZE, INITIAL_OBJECT_SIZE, IObjet3D, IShape3D } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";

@injectable()
export class ObjectGeneratorService {

    private readonly MIN_SCALE: number = 0.5;
    private readonly MAX_SCALE: number = 1.5;
    private readonly WHITE: number = 0x000000;
    private readonly BLACK: number = 0xFFFFFF;
    private readonly B0X_LENGHT: number = 280;
    private readonly MAX_ROTATION: number = 360;
    private readonly CASTLE_WORLD: number = 28;
    private readonly CASTLE_POSITION_X: number = 8; // right / left
    private readonly CASTLE_POSITION_Z: number = 8; // front / back

    public generateRandomGeometricObject(objects: IObjet3D[]): IShape3D {
        const genericObject: IShape3D = this.generateRandom3DShapes(objects);
        genericObject.color = this.randomInt(this.WHITE, this.BLACK);

        return genericObject;
    }
    public addRandomThematicObject(type: string, qty: number, objects: IObjet3D[]): void {
        const obj: IModel3D = {
            type: type,
            texture: "", // we keep the original one for the original scene
            position: this.generatePosition(objects, true, this.CASTLE_WORLD),
            size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size
            rotation: {
                x: 0,
                y: this.randomInt(0, this.MAX_ROTATION),
                z: 0,
            },
        };
        for (let i: number = 0; i < qty; i++) {
            objects.push(obj);
            obj.position = this.generatePosition(objects, true, this.CASTLE_WORLD);
            obj.size = this.random1Interval(this.MIN_SCALE, this.MAX_SCALE);
            obj.rotation.z = this.randomInt(0, this.MAX_ROTATION);
        }

    }

    private generateRandom3DShapes(objects: IObjet3D[]): IShape3D {
        return {
            type: this.randomShape(),
            color: 0,
            position: this.generatePosition(objects, false, this.B0X_LENGHT),
            size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size
            rotation: {
                x: this.randomInt(0, this.MAX_ROTATION),
                y: this.randomInt(0, this.MAX_ROTATION),
                z: this.randomInt(0, this.MAX_ROTATION),
            },
        };
    }

    private generatePosition(objects: IObjet3D[], isThemed: boolean, worldSize: number): {x: number, y: number, z: number} {
        let position: {x: number, y: number, z: number};
        let valid: boolean;
        do {
            position = {
                x: this.randomInt(-worldSize, worldSize),
                y: isThemed ? 0 : this.randomInt(-worldSize, worldSize),
                z: this.randomInt(-worldSize, worldSize),
            };
            valid = true;
            if (isThemed) {
                if (this.isColisionWithCastle(position.x, position.z)
                    || this.isColisionWithModels(position.x, position.y, position.z, objects)) {
                    valid = false;
                }
            } else {
                if (this.isColisionWithShapes(position.x, position.y, position.z, objects)) {
                    valid = false;
                }
            }
        } while (!valid);

        return position;
    }

    private isColisionWithCastle(positionX: number, positionZ: number): boolean {
        return positionX < this.CASTLE_POSITION_X && positionX > -this.CASTLE_POSITION_X &&
            positionZ < this.CASTLE_POSITION_Z && positionZ > -this.CASTLE_POSITION_Z;
    }

    private isColisionWithModels(positionX: number, positionY: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(obj.position.x - positionX, 2) + Math.pow(positionZ - obj.position.z, 2)
            < Math.pow( INITIAL_MODELS_SIZE * this.MAX_SCALE, 2)) {
            return true;
            }
        }

        return false;
    }
    private isColisionWithShapes(positionX: number, positionY: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(obj.position.x - positionX, 2) + Math.pow(positionY - obj.position.y, 2)
            + Math.pow(positionZ - obj.position.z, 2)
            < Math.pow( INITIAL_OBJECT_SIZE * this.MAX_SCALE, 2)) {
            return true;
            }
        }

        return false;
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
