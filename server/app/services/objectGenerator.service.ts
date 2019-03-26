import { injectable } from "inversify";
import { INITIAL_MODEL_SIZE, INITIAL_OBJECT_SIZE, IObjet3D, } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";
import { MODELS } from "../../../common/models/textures";

@injectable()
export class ObjectGeneratorService {

    private readonly MIN_SCALE: number = 0.5;
    private readonly MAX_SCALE: number = 1.5;
    private readonly WHITE: number = 0x000000;
    private readonly BLACK: number = 0xFFFFFF;
    private readonly B0X_LENGHT: number = 45;
    private readonly GEOMETRIC_GAME_SIZE: number = 300;
    private readonly MAX_ROTATION: number = 360;

    private readonly TRAIL_NEG_COORD: number = -15;
    private readonly TRAIL_POS_COORD: number = 5;
    private readonly LEFT_FOUNT_X: number = -30;
    private readonly FOUNTAIN_Z: number = 20;
    private readonly RIGHT_FOUNT_X: number = 20;

    /* the following constants define composition of the medieval forest, expressed in % */
    private readonly MAX_DRAGONS: number = 0.1;
    private readonly MAX_ROCKS: number = 0.1;
    private readonly MAX_FOUNTAINS: number = 0.1;
    private readonly MAX_CARTS: number = 0.05;
    private readonly MAX_BARRELS: number = 0.1;
    private readonly MAX_KNIGHTS: number = 0.2;
    private readonly MAX_HORSES: number = 0.1;
    private readonly MAX_CANONS: number = 0.1;
    private readonly MAX_BALLISTAS: number = 0.05;
    private SCENE_COMPOSITION: Map<string, number> = new Map([
        ["knight", this.MAX_KNIGHTS], ["rock", this.MAX_ROCKS], ["fountain", this.MAX_FOUNTAINS],
        ["cart", this.MAX_CARTS], ["barrel", this.MAX_BARRELS], ["dragon", this.MAX_DRAGONS],
        ["horse", this.MAX_HORSES], ["canon", this.MAX_CANONS], ["ballista", this.MAX_BALLISTAS],
    ]);

    public generateRandomGeometricObject(objects: IObjet3D[]): IObjet3D {
        return {
            type: this.randomShape(),
            color: this.randomInt(this.WHITE, this.BLACK),
            name: objects.length.toString(),
            position: this.generatePosition(objects, false),
            size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size
            rotation: {
                x: this.randomInt(0, this.MAX_ROTATION),
                y: this.randomInt(0, this.MAX_ROTATION),
                z: this.randomInt(0, this.MAX_ROTATION),
            },
        };
    }
    public addThematicObjects(type: string, totalQty: number, objects: IObjet3D[]): IObjet3D[] {
        let qty: number = 0;
        const lastLenght: number = objects.length;
        // tslint:disable-next-line:no-non-null-assertion
        this.SCENE_COMPOSITION.get(type) !== undefined ? qty = this.randomInt(0, this.SCENE_COMPOSITION!.get(type)! * totalQty)
         : qty = totalQty - objects.length;
        for (let i: number = 0; i < qty; i++) {
            const obj: IObjet3D = {
                name: (lastLenght + i).toString(), // object index in array
                type: type,
                position: this.generatePosition(objects, true),
                size: this.random1Interval(this.MIN_SCALE, this.MAX_SCALE), // scale between 50% and 150% of a reference size (= 1 * scale)
                rotation: {
                    x: 0,
                    y: this.randomInt(0, this.MAX_ROTATION),
                    z: 0,
                },
            };
            objects.push(obj);
        }

        return objects;
    }

    public randomModels(): string {
        return MODELS[this.randomInt(0, MODELS.length - 1)];
    }
    public generatePosition(objects: IObjet3D[], isThematic: boolean): {x: number, y: number, z: number} {
        let position: {x: number, y: number, z: number};
        const length: number = isThematic ? this.B0X_LENGHT : this.GEOMETRIC_GAME_SIZE;
        let valid: boolean;
        do {
            position = {
                x: this.randomInt(-length, length),
                y: isThematic ? 0 : this.randomInt(-length, length),
                z: this.randomInt(-length, length),
            };
            valid = true;
            if (isThematic) {
                valid = ! (this.isColisionWithTrail(position.x) ||
                this.isColisionWithModels(position.x, position.z, objects) ||
                this.isColisionWithFountains(position.x, position.z));
            } else {
                valid = !this.isColisionWithShapes(position.x, position.y, position.z, objects);
            }
            valid = true;
        } while (!valid);

        return position;

    }
    private isColisionWithTrail(positionX: number): boolean {
        return positionX > this.TRAIL_NEG_COORD && positionX < this.TRAIL_POS_COORD;
    }
    private isColisionWithFountains(positionX: number, positionZ: number): boolean {
        const fountains: IObjet3D[] = [
            {
                type: "",
                position: { x: this.LEFT_FOUNT_X, y: 0, z: this.FOUNTAIN_Z},
                size: 1,
                rotation: {x: 0, y: 0, z: 0},
                name: "",
            },
            {
                type: "",
                position: { x: this.RIGHT_FOUNT_X, y: 0, z: this.FOUNTAIN_Z},
                size: 1,
                rotation: {x: 0, y: 0, z: 0},
                name: "",
            },
        ];

        return this.isColisionWithModels(positionX, positionZ, fountains);
    }

    private isColisionWithModels(positionX: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(Math.abs(obj.position.x - positionX), 2) + Math.pow(Math.abs(positionZ - obj.position.z), 2)
            < Math.pow( INITIAL_MODEL_SIZE * this.MAX_SCALE, 2)) {
            return true;
            }
        }

        return false;
    }
    private isColisionWithShapes(positionX: number, positionY: number, positionZ: number, objects: IObjet3D[]): boolean {
        for (const obj of objects) {
            if (Math.pow(Math.abs(obj.position.x - positionX), 2) + Math.pow(Math.abs(positionY - obj.position.y), 2)
            + Math.pow(Math.abs(positionZ - obj.position.z), 2)
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
