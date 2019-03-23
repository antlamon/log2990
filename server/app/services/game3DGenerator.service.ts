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
            obj.name = i.toString();
            objects.push(obj);
            do  {
                backGroundColor = this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR); // we go for pale colors
            } while (!this.game3DModificator.isEnoughContrast(backGroundColor, objects[i].color as number));
        }

        return backGroundColor;
    }
    private generateObjThematicBackground(objects: IObjet3D[], quantity: number): number {

        for (let i: number = 0; i < quantity; i++) {
            const obj: IObjet3D = this.objectGenerator.generateRandomThematicObject(objects);
            obj.name = i.toString();
            objects.push(obj);
        }

        return this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR);
    }

    private generateGame(form: IGame3DForm): IGame3D {

        const randomObjects: IObjet3D[] = [];
        let backGroundColor: number = 0;
        if ( form.objectType === GEOMETRIC_TYPE_NAME ) {
            backGroundColor = this.generateObjGeometricBackground(randomObjects, form.objectQty);
        } else if ( form.objectType === THEMATIC_TYPE_NAME) {
            backGroundColor = this.generateObjThematicBackground(randomObjects, form.objectQty);
        } else {
            throw new TYPE_ERROR("The type chosen for the new 3D game is not valid.");
        }

        return {
            name: form.name,
            id: (new ObjectID()).toHexString(),
            originalScene: randomObjects,
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
            differences: this.game3DModificator.createModifScene(randomObjects, form.objectType, form.modifications),
            isThematic: form.objectType === THEMATIC_TYPE_NAME,
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
