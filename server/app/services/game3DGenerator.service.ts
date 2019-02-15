import { injectable, inject } from "inversify";
import { TYPES } from "../types"
import { Game3D } from "../../../common/models/game3D";
import { IGame3DForm } from "../../../common/models/game";
import { Objet3D } from "../../../common/models/objet3D";
import { ITop3 } from "../../../common/models/top3";
import { Game3DModificatorService } from "./game3DModificator.service";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DGeneratorService {

    private static id: number = 1;

    private readonly MINIMUM_CONTRAST: number = 0x00000F;
    private readonly TYPE_ERROR: Error = {
        name: "Invalid game3D type: ",
        message: "The type chosen for the new 3D game is not valid."
    };

    public constructor(@inject(TYPES.Game3DModificatorService) private game3DModificator: Game3DModificatorService, 
    @inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService) {}

    public createRandom3DGame(form: IGame3DForm): Game3D {
        if ( form.objectType === "geometric" ) {
            return this.generateGeometryGame(form);
        } else if ( form.objectType === "themed" ) {
            return this.generateThemeGame(form);
        } else {
            throw this.TYPE_ERROR;
        }
    }

    private generateGeometryGame(form: IGame3DForm): Game3D {

        const randomObjects: Objet3D[] = [];
        let backGroundColor: number = this.objectGenerator.randomInt(0x0F0F0F, 0xFFFFFF); // we go for pale colors
        // tslint:disable-next-line:typedef
        for (let i = 0; i < form.objectQty; i++) {
            const obj: Objet3D = this.objectGenerator.generateRandom3Dobject();
            
            let valid: boolean = true;
            for(let i = 0; i < randomObjects.length; i++) {
                if(Math.pow(randomObjects[i].position.x-obj.position.x,2)+ Math.pow(obj.position.y-randomObjects[i].position.y,2) + Math.pow(obj.position.z-randomObjects[i].position.z,2)
                < Math.pow(43,2)) {
                valid = false;
                }
            }
            if(valid) {
                randomObjects.push(obj);
            } else {
                i--;
            }
    //   }
            while (!this.isEnoughContrast(backGroundColor, randomObjects[i].color)) {
                backGroundColor = this.objectGenerator.randomInt(0x0F0F0F, 0xFFFFFF);
            }
        }

        return {
            name: form.name,
            id: Game3DGeneratorService.id++,
            numObj: form.objectQty,
            originalObjects: randomObjects,
            modifiedObjects: this.game3DModificator.createModifScene(randomObjects, form.objectType, form.modifications),
            backColor: backGroundColor,       
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
        };
    }

    private isEnoughContrast(backGroundColor: number, objColor: number): boolean {
        //we want positive values, check for min and max
        let max: number;
        let min: number;
        if (backGroundColor > objColor) {
            max = backGroundColor;
            min = objColor;
        } else {
            max = objColor;
            min = backGroundColor;
        }

        return (max - min) >= this.MINIMUM_CONTRAST;
    }


    public top3RandomOrder(): ITop3 {
        const scores: number[] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push(this.objectGenerator.randomInt(700, 1000));
        }
        scores.sort();

        return { first: scores[0], second: scores[1], third: scores[2] };
    }

    private generateThemeGame(form: IGame3DForm): Game3D {
        return this.generateGeometryGame(form); // for now... themed 3Dgame not implemented yet
    }

}
