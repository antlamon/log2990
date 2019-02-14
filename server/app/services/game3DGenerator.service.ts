import { injectable } from "inversify";
import { Game3D } from "../../../common/models/game3D";
import { IGame3DForm } from "../../../common/models/game";
import { Objet3D } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";
import { ITop3 } from "../../../common/models/top3";
@injectable()
export class Game3DGeneratorService {

    private static id: number = 1;

    private readonly MINIMUM_CONTRAST: number = 0x00000F;
    private readonly TYPE_ERROR: Error = {
        name: "Invalid game3D type: ",
        message: "The type chosen for the new 3D game is not valid. "
    };

    public createRandom3DGame(form: IGame3DForm): Game3D {
        if ( form.objectType === "geometric" ) {
            return this.generateGeometryGame(form);
        } else {
            if ( form.objectType === "themed" ) {
                return this.generateThemeGame(form);
            } else {
                throw this.TYPE_ERROR;
            }
        }
    }

    private generateGeometryGame(form: IGame3DForm): Game3D {

        const randomObjects: Objet3D[] = [];
        let backGroundColor: number = this.randomInt(0x0F0F0F, 0xFFFFFF); // we go for pale colors
        // tslint:disable-next-line:typedef
        for (let i = 0; i < form.objectQty; i++) {
            const obj: Objet3D = this.generateRandom3Dobject();
            
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
                backGroundColor = this.randomInt(0x0F0F0F, 0xFFFFFF);
            }
        }

        return {
            name: form.name,
            id: Game3DGeneratorService.id++,
            numObj: form.objectQty,
            objects: randomObjects,
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

    private generateRandom3Dobject(): Objet3D {
        return {
            type: this.randomShape(),
            color: this.randomInt(0x000000, 0xFFFFFF),
            position: {
                x: this.randomInt(-300, 300),
                y: this.randomInt(-300, 300),
                z: this.randomInt(-300, 300),
            },
            size: this.randomDecimal(0.5, 1.5), // scale between 50% and 150% of a reference size
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

    private randomInt(min: number, max: number): number {
        return Math.floor(this.randomNumber(min, max));
    }

    private randomDecimal(min: number, max: number): number {

        return Math.random() + min;
        
    }

    private randomNumber(min: number, max: number): number {

        return Math.random() * (max - min + 1) + min;
    }

    public top3RandomOrder(): ITop3 {
        const scores: number[] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push(this.randomInt(700, 1000));
        }
        scores.sort();

        return { first: scores[0], second: scores[1], third: scores[2] };
    }

    private generateThemeGame(form: IGame3DForm): Game3D {
        return this.generateGeometryGame(form); // for now... themed 3Dgame not implemented yet
    }

}
