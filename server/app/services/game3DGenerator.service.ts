import { ObjectID } from "bson";
import { inject, injectable } from "inversify";
import { TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, IGame3D, IScene3D, THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { IObjet3D, MAX_COLOR } from "../../../common/models/objet3D";
import { ITop3 } from "../../../common/models/top3";
import { TYPES } from "../types";
import { FormValidatorService } from "./formValidator.service";
import { GameListService } from "./game-list.service";
import { Game3DModificatorService } from "./game3DModificator.service";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DGeneratorService {

    private readonly PALE_COLOR: number = 0x0F0F0F;
    public constructor(@inject(TYPES.Game3DModificatorService) private game3DModificator: Game3DModificatorService,
                       @inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService,
                       @inject(TYPES.FormValidatorService) private formValidator: FormValidatorService) {}

    public createRandom3DGame(form: IGame3DForm): IGame3D {

        this.formValidator.validate3DForm(form);

        return this.generateGame(form);

    }
    private generateObjGeometricBackground(objects: IObjet3D[], quantity: number): number {
        let backGroundColor: number = 0;
        for (let i: number = 0; i < quantity; i++) {
            const obj: IObjet3D = this.objectGenerator.generateRandomGeometricObject(objects);
            objects.push(obj);
            do  {
                backGroundColor = this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR); // we go for pale colors
            } while (!this.game3DModificator.isEnoughContrast(backGroundColor, objects[i].color));
        }

        return backGroundColor;
    }
    private generateObjThematicBackground(objects: IObjet3D[], quantity: number): number {

        for (let i: number = 0; i < quantity; i++) {
            const obj: IObjet3D = this.objectGenerator.generateRandomThematicObject(objects);
            objects.push(obj);
        }

        return this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR);
    }

    private generateGame(form: IGame3DForm): IGame3D {

        const randomObjects: IObjet3D[] = [];
        let backGroundColor: number = 0;
        let tempDifferences: [string, number][] =[];
        if ( form.objectType === GEOMETRIC_TYPE_NAME ) {
            backGroundColor = this.generateObjGeometricBackground(randomObjects, form.objectQty);
        } else if ( form.objectType === THEMATIC_TYPE_NAME) {
            backGroundColor = this.generateObjThematicBackground(randomObjects, form.objectQty);
        } else {
            throw new TYPE_ERROR("The type chosen for the new 3D game is not valid.");
        }

        const scene: IScene3D = { modified: false,
                                  objects: randomObjects,
                                  numObj: form.objectQty,
                                  backColor: backGroundColor,
                                };

        return {
            name: form.name,
            id: (new ObjectID()).toHexString(),
            originalScene: scene,
            modifiedScene: this.game3DModificator.createModifScene(scene, form.objectType, form.modifications, tempDifferences),
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
            differencesIndex: tempDifferences,
        };
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

}
