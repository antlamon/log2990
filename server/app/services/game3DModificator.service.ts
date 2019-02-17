import { injectable, inject } from "inversify";
import { TYPES } from "../types"
import { Objet3D } from "../../../common/models/objet3D";
import { ObjectGeneratorService } from "./objectGenerator.service";
import { Scene3D } from "../../../common/models/game3D";


@injectable()
export class Game3DModificatorService {

    private static readonly NB_DIFF: number = 7;
    private static readonly ADD: number = 1;
    private static readonly DELETE: number = 2;
    private static readonly COLOR: number = 3;

    public constructor(@inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService) {}

    public createModifScene(originalScene: Scene3D, typeObj: string, 
        typeModif:  {add: boolean, delete: boolean, color: boolean}): Scene3D {
        
        const modifiedObjects: Objet3D[] = [];
        const indexModif: number[] = this.randomIndex(originalScene.objects.length);
        
        for(let i: number = 0; i < originalScene.objects.length; i++) {

            let newObj: Objet3D | null = originalScene.objects[i];

            for(let no of indexModif) {
                if(no === i) {                  
                    newObj = this.createDifference((newObj) as Objet3D, modifiedObjects, typeObj, typeModif); 
                }
            }
            if(newObj !== null) {
                modifiedObjects.push(newObj);
            }
        }
        return {modified: true,
                numObj: modifiedObjects.length,
                objects: modifiedObjects,
                backColor: originalScene.backColor };

    }
    
    private createDifference(obj: Objet3D, objects: Objet3D[], typeObj: string, typeModif:  {add: boolean, delete: boolean, color: boolean}): Objet3D | null {

        switch(this.chooseModif(typeModif)) {
            case(Game3DModificatorService.ADD): {
                this.addObject(objects);
                break;
            }
            case(Game3DModificatorService.DELETE): {
                return null;
            }
            case(Game3DModificatorService.COLOR): {
                if(typeObj == "geometric") {
                    return this.changeColor(obj);
                } else {
                    return this.changeTexture(obj);
                }
            }
           
        }
        return obj;
        
    }

    private addObject(objects: Objet3D[]): void {

        objects.push(this.objectGenerator.generateRandom3Dobject());
    }

    private changeColor(obj: Objet3D): Objet3D {
        return {
            type: obj.type,
            color: this.objectGenerator.randomInt(0x000000, 0xFFFFFF),
            position: obj.position,
            size: obj.size,
            rotation: obj.rotation
        }
    }

    private changeTexture(obj: Objet3D): Objet3D {

        return this.changeColor(obj); //Pour le moment texture non implémenté
    }

    private randomIndex(size: number): number[] {

        const index: number[] = [];
        while(index.length < Game3DModificatorService.NB_DIFF) {
            const randInt: number = Math.floor(Math.random() * size); 
            if(index.indexOf(randInt) === -1) {
                index.push(randInt);
            }
        }
        return index;
    }
    
    private chooseModif(typeModif:  {add: boolean, delete: boolean, color: boolean}): number {

        while(true) {
            const randModif = this.objectGenerator.randomInt(1,3);
            switch(randModif) {
                case Game3DModificatorService.ADD: {
                    if(typeModif.add) {
                        return Game3DModificatorService.ADD;
                    }
                    break;
                }
                case(Game3DModificatorService.DELETE): {
                    if(typeModif.delete) {
                        return Game3DModificatorService.DELETE;
                    }
                    break;
                }
                case Game3DModificatorService.COLOR: {
                    if(typeModif.color) {
                        return Game3DModificatorService.COLOR;
                    }
                    break;
                }
                default: {}
            }
        }

    }



    
}