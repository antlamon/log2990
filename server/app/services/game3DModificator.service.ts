import { inject, injectable } from "inversify";
import { ADD_TYPE, DELETE_TYPE, GEOMETRIC_TYPE_NAME, IDifference, MODIFICATION_TYPE } from "../../../common/models/game3D";
import { IObjet3D, MAX_COLOR } from "../../../common/models/objet3D";
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

    public createModifScene(originalScene: IObjet3D[], typeObj: string,
                            typeModif:  {add: boolean, delete: boolean, color: boolean}): IDifference[] {

        const modifiedObjects: IObjet3D[] = [];
        const indexModif: number[] = this.randomIndex(originalScene.length);
        const differences: IDifference[] = [];
        for (let i: number = 0; i < originalScene.length; i++) {

            for (const no of indexModif) {
                if (no === i) {
                    differences.push(this.createDifference(originalScene[i], modifiedObjects, typeObj, typeModif));
                }
            }
        }
        let nbAdded: number = 0;
        for (const diff of differences) {
            if (diff.type === ADD_TYPE) {
                diff.name = (originalScene.length + nbAdded).toString();
                nbAdded++;
            }
        }

        return differences;

    }

    private createDifference(obj: IObjet3D, objects: IObjet3D[], typeObj: string,
                             typeModif:  {add: boolean, delete: boolean, color: boolean}): IDifference {

        // tslint:disable-next-line:switch-default
        switch (this.chooseModif(typeModif)) {
            case(Game3DModificatorService.ADD): {
                return {name: "", type: ADD_TYPE, object: this.objectGenerator.generateRandomGeometricObject(objects)};
            }
            case(Game3DModificatorService.DELETE): {
                return {name: obj.name, type: DELETE_TYPE, object: this.createObject(objects, typeObj)};
            }
            case(Game3DModificatorService.COLOR): {
                const temp: IObjet3D = (typeObj === GEOMETRIC_TYPE_NAME) ? this.changeColor(obj) : this.changeTexture(obj);

                return {object: temp, name: obj.name, type: MODIFICATION_TYPE};
            }

        }

        return obj;

    }

    private createObject(objects: IObjet3D[], typeObj: string): IObjet3D {
        if (typeObj === GEOMETRIC_TYPE_NAME) {
            return this.objectGenerator.generateRandomGeometricObject(objects);
        } else {
            return this.objectGenerator.generateRandomThematicObject(objects);
        }
    }

    private changeColor(obj: IObjet3D): IObjet3D {
        let newColor: number;
        do {
            newColor = this.objectGenerator.randomInt(0x000000, MAX_COLOR);
        } while (!this.isEnoughContrast(obj.color as number, newColor));

        return {
            type: obj.type,
            name: obj.name,
            color: newColor,
            texture: "",
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation,
        };
    }

    private changeTexture(obj: IObjet3D): IObjet3D {

        const previousText: string = obj.texture as string;
        let newText: string;
        do {
            newText = this.objectGenerator.randomTexture();
        }   while (newText === previousText);

        return {
            type: obj.type,
            name: obj.name,
            color: 0,
            texture: newText,
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation,
        };
    }
    public isEnoughContrast(otherColor: number, objColor: number): boolean {
        // we want positive values, check for min and max
        return Math.abs(otherColor - objColor) >= this.MINIMUM_CONTRAST;
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
