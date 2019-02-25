import { inject, injectable } from "inversify";
import { GEOMETRIC_TYPE_NAME, Scene3D } from "../../../common/models/game3D";
import { MAX_COLOR, Objet3D  } from "../../../common/models/objet3D";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DModificatorService {

    public static readonly NB_DIFF: number = 7;
    private static readonly ADD: number = 1;
    private static readonly DELETE: number = 2;
    private static readonly COLOR: number = 3;

    public constructor(@inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService) {}

    public createModifScene(originalScene: Scene3D, typeObj: string,
                            typeModif:  {add: boolean, delete: boolean, color: boolean}): Scene3D {

        const modifiedObjects: Objet3D[] = [];
        const indexModif: number[] = this.randomIndex(originalScene.objects.length);

        for (let i: number = 0; i < originalScene.objects.length; i++) {

            let newObj: Objet3D | null = originalScene.objects[i];

            for (const no of indexModif) {
                if (no === i) {
                    newObj = this.createDifference((newObj) as Objet3D, modifiedObjects, typeObj, typeModif);
                }
            }
            if (newObj !== null) {
                modifiedObjects.push(newObj);
            }
        }

        return {modified: true,
                numObj: modifiedObjects.length,
                objects: modifiedObjects,
                backColor: originalScene.backColor };

    }

    private createDifference(obj: Objet3D, objects: Objet3D[], typeObj: string,
                             typeModif:  {add: boolean, delete: boolean, color: boolean}): Objet3D | null {

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
                    return this.changeTexture(obj);
                }
            }

        }

        return obj;

    }

    private addObject(objects: Objet3D[], typeObj: string): void {
        if (typeObj === GEOMETRIC_TYPE_NAME) {
            objects.push(this.objectGenerator.generateRandomGeometricObject(objects));
        } else {
            objects.push(this.objectGenerator.generateRandomThematicObject(objects));
        }
    }

    private changeColor(obj: Objet3D): Objet3D {
        return {
            type: obj.type,
            color: this.objectGenerator.randomInt(0x000000, MAX_COLOR),
            texture: "",
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation,
        };
    }

    private changeTexture(obj: Objet3D): Objet3D {

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
                    if (typeModif.add) {
                        valid = true;
                    }
                    break;
                }
                case(Game3DModificatorService.DELETE): {
                    if (typeModif.delete) {
                        valid = true;
                    }
                    break;
                }
                case Game3DModificatorService.COLOR: {
                    if (typeModif.color) {
                        valid = true;
                    }
                    break;
                }
            }
        }

        return randModif;
    }

}
