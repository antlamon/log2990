import { inject, injectable } from "inversify";
import { GEOMETRIC_TYPE_NAME, IScene3D } from "../../../common/models/game3D";
import { IObjet3D, IShape3D , MAX_COLOR } from "../../../common/models/objet3D";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DModificatorService {

    public static readonly NB_DIFF: number = 7;
    private static readonly ADD: number = 1;
    private static readonly DELETE: number = 2;
    private static readonly COLOR: number = 3;
    private readonly MINIMUM_CONTRAST: number = 0x00000F;

    public constructor(@inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService) {}

    public createModifScene(originalScene: IScene3D, typeObj: string,
                            typeModif:  {add: boolean, delete: boolean, color: boolean}): IScene3D {

        const modifiedObjects: IObjet3D[] = [];
        const indexModif: number[] = this.randomIndex(originalScene.objects.length);

        for (let i: number = 0; i < originalScene.objects.length; i++) {

            let newObj: IObjet3D | null = originalScene.objects[i];

            for (const no of indexModif) {
                if (no === i) {
                    newObj = this.createDifference((newObj) as IObjet3D, modifiedObjects, typeObj, typeModif);
                }
            }
            if (newObj !== null) {
                modifiedObjects.push(newObj);
            }
        }

        return {
                objects: modifiedObjects,
                backColor: originalScene.backColor };

    }

    private createDifference(obj: IObjet3D, objects: IObjet3D[], typeObj: string,
                             typeModif:  {add: boolean, delete: boolean, color: boolean}): IObjet3D | null {

        // tslint:disable-next-line:switch-default
        switch (this.chooseModif(typeModif)) {
            case(Game3DModificatorService.ADD): {
                this.addObject(objects, typeObj);
                break;
            }
            case(Game3DModificatorService.DELETE): {
                return null;
            }
            case(Game3DModificatorService.COLOR): {
                if (typeObj === GEOMETRIC_TYPE_NAME) {
                    return this.changeColor(obj);
                } else {
                    return this.changeColor(obj); /*this.changeTexture(obj);*/
                }
            }

        }

        return obj;

    }

    private addObject(objects: IObjet3D[], typeObj: string): void {
        if (typeObj === GEOMETRIC_TYPE_NAME) {
            objects.push(this.objectGenerator.generateRandomGeometricObject(objects));
        } else {
            objects.push(this.objectGenerator.generateRandomThematicObject(objects));
        }
    }

    private changeColor(obj: IObjet3D): IShape3D {
        let newColor: number;
        do {
            newColor = this.objectGenerator.randomInt(0x000000, MAX_COLOR);
        } while (!this.isEnoughContrast((obj as IShape3D).color, newColor));

        return {
            type: obj.type,
            color: newColor,
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation,
        };
    }
    // TODO: ADAPT TO NEW interface
    /*private changeTexture(obj: IObjet3D): IObjet3D {

        const previousText: string = obj.texture;
        let newText: string;
        do {
            newText = this.objectGenerator.randomTexture();
        }   while (newText === previousText);

        return {
            type: obj.type,
            color: 0,
            texture: newText,
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation,
        };
    }*/
    public isEnoughContrast(otherColor: number, objColor: number): boolean {
        // we want positive values, check for min and max
        let max: number;
        let min: number;
        if (otherColor > objColor) {
            max = otherColor;
            min = objColor;
        } else {
            max = objColor;
            min = otherColor;
        }

        return (max - min) >= this.MINIMUM_CONTRAST;
    }

    private randomIndex(size: number): number[] {

        const index: number[] = [];
        while (index.length < Game3DModificatorService.NB_DIFF) {
            const randInt: number = Math.floor(Math.random() * size);
            if (index.indexOf(randInt) === -1) {
                index.push(randInt);
            }
        }

        return index;
    }

    private chooseModif(typeModif:  {add: boolean, delete: boolean, color: boolean}): number {

        let valid: boolean = false;
        let randModif: number = 0;
        while (!valid) {
            randModif = this.objectGenerator.randomInt(Game3DModificatorService.ADD, Game3DModificatorService.COLOR);
            // tslint:disable-next-line:switch-default
            switch (randModif) {
                case Game3DModificatorService.ADD: {
                    valid = typeModif.add;
                    break;
                }
                case(Game3DModificatorService.DELETE): {
                    valid = typeModif.delete;
                    break;
                }
                case Game3DModificatorService.COLOR: {
                    valid = typeModif.color;
                    break;
                }
            }
        }

        return randModif;
    }

}
