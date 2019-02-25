import { ObjectID } from "bson";
import { inject, injectable } from "inversify";
import { FORM_ERROR, TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { Game3D, GEOMETRIC_TYPE_NAME, NO_MAX_OBJECTS, NO_MIN_OBJECTS, Scene3D, THEMATIC_TYPE_NAME, } from "../../../common/models/game3D";
import { MAX_COLOR, Objet3D } from "../../../common/models/objet3D";
import { ITop3 } from "../../../common/models/top3";
import { TYPES } from "../types";
import { GameListService } from "./game-list.service";
import { Game3DModificatorService } from "./game3DModificator.service";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DGeneratorService {

    private readonly MINIMUM_CONTRAST: number = 0x00000F;
    private readonly PALE_COLOR: number = 0x0F0F0F;

    public constructor(@inject(TYPES.Game3DModificatorService) private game3DModificator: Game3DModificatorService,
                       @inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService) {}

    public createRandom3DGame(form: IGame3DForm): Game3D {

        this.formValidator(form);

        return this.generateGame(form);

    }
    private generateObjGeometricBackground(objects: Objet3D[], quantity: number): number {
        let backGroundColor: number = 0;
        for (let i: number = 0; i < quantity; i++) {
            const obj: Objet3D = this.objectGenerator.generateRandomGeometricObject(objects);
            objects.push(obj);
            do  {
                backGroundColor = this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR); // we go for pale colors
            } while (!this.isEnoughContrast(backGroundColor, objects[i].color));
        }

        return backGroundColor;
    }
    private generateObjThematicBackground(objects: Objet3D[], quantity: number): number {

        for (let i: number = 0; i < quantity; i++) {
            const obj: Objet3D = this.objectGenerator.generateRandomThematicObject(objects);
            objects.push(obj);
        }

        return this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR);
    }

    private generateGame(form: IGame3DForm): Game3D {

        const randomObjects: Objet3D[] = [];

        let backGroundColor: number = 0;

        if ( form.objectType === GEOMETRIC_TYPE_NAME ) {
            backGroundColor = this.generateObjGeometricBackground(randomObjects, form.objectQty);
        } else if ( form.objectType === THEMATIC_TYPE_NAME) {
            backGroundColor = this.generateObjThematicBackground(randomObjects, form.objectQty);
        } else {
            throw new TYPE_ERROR("The type chosen for the new 3D game is not valid.");
        }

        const scene: Scene3D = { modified: false,
                                 objects: randomObjects,
                                 numObj: form.objectQty,
                                 backColor: backGroundColor,
                                };

        return {
            name: form.name,
            id: (new ObjectID()).toHexString(),
            originalScene: scene,
            modifiedScene: this.game3DModificator.createModifScene(scene, form.objectType, form.modifications),
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
        };
    }

    private isEnoughContrast(backGroundColor: number, objColor: number): boolean {
        // we want positive values, check for min and max
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
            scores.push(this.objectGenerator.randomInt(GameListService.MIN_TIME_TOP_3, GameListService.MAX_TIME_TOP_3));
        }
        scores.sort();

        return { first: {name: "GoodComputer", score: scores[0].toString() + ":00"},
                 second: {name: "MediumComputer", score: scores[1].toString() + ":00"},
                 third: {name: "BadComputer", score: scores[2].toString() + ":00"},
                };
    }

    private formValidator(form: IGame3DForm): void {
        if (form.objectQty < NO_MIN_OBJECTS || form.objectQty > NO_MAX_OBJECTS) {
            throw new FORM_ERROR("Le nombre d'objets doit être entre 10 et 200");
        } else if (!form.modifications.add && !form.modifications.delete && !form.modifications.color) {
            throw new FORM_ERROR("Il faut choisir au moins une modification");
        }
    }

}
