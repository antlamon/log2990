import {injectable } from "inversify";
import { Game3D } from "../../../common/models/game3D";
import { IGame3DForm } from "../../../common/models/game";
import { Objet3D } from "../../../common/models/objet3D";
import { Shapes, SHAPES_SIZE } from "../../../common/models/shapes";

@injectable()
export class Game3DGeneratorService {

    private readonly minimumContrast: number = 0x00000F;

    public createRandom3DGame(form: IGame3DForm): Game3D {
        if ( form.objectType === "geometric" ) {
            console.log(this.createRandom3DGame(form)); // testing
            return this.generateGeometryGame(form);
        } else {
            return this.generateThemeGame(form);
        }
    }

    private generateGeometryGame(form: IGame3DForm): Game3D {

        const randomObjects: Objet3D[] = [];
        let backGroundColor: number = this.randomNumber(0x0F0F0F, 0xFFFFFF); // we go for pale colors
        // tslint:disable-next-line:typedef
        for (let i = 0; i < form.objectQty; i++) {
            randomObjects.push(this.generateRandom3Dobject());
            while(!this.isEnoughContrast(backGroundColor, randomObjects[i].color)){
                backGroundColor = this.randomNumber(0x0F0F0F, 0xFFFFFF);
            }
        }

        return {
            name: form.name,
            numObj: form.objectQty,
            objects: randomObjects,
            backColor: backGroundColor, 
        };
    }

    private isEnoughContrast(backGroundColor: number, objColor: number): boolean {
        //we want positive values, check for min and max
        let max: number;
        let min: number;
        if(backGroundColor > objColor ){
            max = backGroundColor;
            min = objColor;
        } else {
            max = objColor;
            min = backGroundColor;
        }

        return (max - min) >= this.minimumContrast;
    }

    private generateRandom3Dobject(): Objet3D {
        return {
            type: this.randomShape(),
            color: this.randomNumber(0x000000, 0xFFFFFF),
            position: { 
                        x: this.randomNumber(0,200),
                        y: this.randomNumber(0,200),
                        z: this.randomNumber(0,200),
                    },
            size: this.randomNumber(0.5,1.5), // scale between 50% and 150% of a reference size
            rotation: {
                        x: this.randomNumber(0,360), 
                        y: this.randomNumber(0,360), 
                        z: this.randomNumber(0,360)
                    },
        };
    }
    private randomShape(): string {
        let index: number = this.randomNumber(0, SHAPES_SIZE);
        return Shapes[index];
    }
    private randomNumber(min: number, max: number): number {
        // tslint:disable-next-line:no-magic-numbers
        return Math.random() * (max - min + 1) + min;
    }

    private generateThemeGame(form: IGame3DForm): Game3D {
        return this.generateGeometryGame(form); // for now... themed 3Dgame not implemented yet
    }
}
