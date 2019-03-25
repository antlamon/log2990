import { ObjectID } from "bson";
import { inject, injectable } from "inversify";
import { TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, IGame3D, THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { IObjet3D, MAX_COLOR } from "../../../common/models/objet3D";
import { IScore } from "../../../common/models/top3";
import { TYPES } from "../types";
import { FormValidatorService } from "./formValidator.service";
import { GameListService } from "./game-list.service";
import { Game3DModificatorService } from "./game3DModificator.service";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DGeneratorService {

    public static readonly NB_SECONDS_IN_MIN: number = 60;
    public static readonly FORMAT_DOUBLE_DIGIT_MAX: number = 10;
    private readonly PALE_COLOR: number = 0x0F0F0F;
    private readonly VARIABLE_MODELS: string[] = [ // models except for trees, that are in all scenes
        "dragon", "rock", "fountain", "horse", "barrel",
    ];
    public constructor(@inject(TYPES.Game3DModificatorService) private game3DModificator: Game3DModificatorService,
                       @inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService,
                       @inject(TYPES.FormValidatorService) private formValidator: FormValidatorService) {}

    public createRandom3DGame(form: IGame3DForm): IGame3D {

        this.formValidator.validate3DForm(form);

        let game: IGame3D;
        if ( form.objectType === GEOMETRIC_TYPE_NAME ) {
            game = this.generateObjGeometricScene(form.objectQty, form.name, form.modifications);
        } else if ( form.objectType === THEMATIC_TYPE_NAME) {
            game = this.generateObjThematicScene(form.objectQty, form.name, form.modifications);
        } else {
            throw new TYPE_ERROR("The type chosen for the new 3D game is not valid.");
        }

        return game;
    }
    private generateObjGeometricScene(quantity: number, name: string,
                                      modifType: {add: boolean, delete: boolean, color: boolean} ): IGame3D {
        const objects: IObjet3D[] = [];
        let backGroundColor: number = 0;

        for (let i: number = 0; i < quantity; i++) {
            const obj: IObjet3D = this.objectGenerator.generateRandomGeometricObject(objects);
            obj.name = i.toString();
            objects.push(obj);
            do  {
                backGroundColor = this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR); // we go for pale colors
            } while (!this.game3DModificator.isEnoughContrast(backGroundColor, objects[i].color as number));
        }

        return {
            name: name,
            id: (new ObjectID()).toHexString(),
            originalScene: objects,
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
            isThematic: false,
            differences: this.game3DModificator.createModifScene(objects, GEOMETRIC_TYPE_NAME, modifType),
            backColor: backGroundColor,
        };
    }

    private generateObjThematicScene(quantity: number, name: string,
                                     modifType: {add: boolean, delete: boolean, color: boolean} ): IGame3D {
        const backGroundColor: number = 0xFFFFFF; // no specific background color needed, using a skybox
        const objects: IObjet3D[] = [];
        for (const models of this.VARIABLE_MODELS) {
            this.objectGenerator.addThematicObjects(models, quantity, objects);
        }
        this.objectGenerator.addThematicObjects("tree1", quantity, objects); // remaining objects are trees.

        return {
            name: name,
            id: (new ObjectID()).toHexString(),
            originalScene: objects,
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
            isThematic: true,
            differences: this.game3DModificator.createModifScene(objects, THEMATIC_TYPE_NAME, modifType),
            backColor: backGroundColor,
        };

    }

    public top3RandomOrder(): IScore[] {
        const scores: [number, number][] = [];
        for (let i: number = 0; i < 3; i++) {
            scores.push([this.randomNumber(GameListService.MIN_TIME_TOP_3, GameListService.MAX_TIME_TOP_3),
                         this.randomNumber(0, Game3DGeneratorService.NB_SECONDS_IN_MIN)]);
        }
        scores.sort((x: [number, number], y: [number, number]) => (x[0] * Game3DGeneratorService.NB_SECONDS_IN_MIN + x[1]) -
        (y[0] * Game3DGeneratorService.NB_SECONDS_IN_MIN + y[1]));
        const tempTop3: IScore[] = [];
        tempTop3.push({name: "GoodComputer",  score: this.formatTimeScore(scores[0][0], scores[0][1])});
        tempTop3.push({name: "MediumComputer", score: this.formatTimeScore(scores[1][0], scores[1][1])});
        tempTop3.push({name: "BadComputer", score: this.formatTimeScore(scores[2][0], scores[2][1])});

        return tempTop3;
    }
    private formatTimeScore(nbMinutes: number, nbSeconds: number): string {
        return this.formatTime(nbMinutes) + ":" + this.formatTime(nbSeconds);
    }
    private formatTime(time: number): string {
        return ((time < Game3DGeneratorService.FORMAT_DOUBLE_DIGIT_MAX) ? "0" : "") + time.toString();
    }
    private randomNumber(min: number, max: number): number {
        return Math.round(Math.random() * (max - min + 1) + min);
    }

}
