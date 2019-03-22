import { ObjectID } from "bson";
import { inject, injectable } from "inversify";
import { TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, IGame3D, IScene3D, THEMATIC_TYPE_NAME, } from "../../../common/models/game3D";
import { IObjet3D, IShape3D, MAX_COLOR } from "../../../common/models/objet3D";
import { ITop3 } from "../../../common/models/top3";
import { TYPES } from "../types";
import { FormValidatorService } from "./formValidator.service";
import { GameListService } from "./game-list.service";
import { Game3DModificatorService } from "./game3DModificator.service";
import { ObjectGeneratorService } from "./objectGenerator.service";

@injectable()
export class Game3DGeneratorService {

    private readonly PALE_COLOR: number = 0x0F0F0F;

    /* the following constants define composition of the medieval forest, expressed in % */
    private readonly MAX_KNIGHTS: number = 0.1;
    private readonly MAX_BENCH: number = 0.2;
    private readonly MAX_DRAGONS: number = 0.1;
    private readonly MAX_BALISTAS: number = 0.1;
    private readonly MAX_ROCKS: number = 0.2;
    private readonly MAX_HORSES: number = 0.2;

    public constructor(@inject(TYPES.Game3DModificatorService) private game3DModificator: Game3DModificatorService,
                       @inject(TYPES.ObjectGeneratorService) private objectGenerator: ObjectGeneratorService,
                       @inject(TYPES.FormValidatorService) private formValidator: FormValidatorService) {}

    public createRandom3DGame(form: IGame3DForm): IGame3D {

        this.formValidator.validate3DForm(form);

        return this.generateGame(form);

    }

    private generateGame(form: IGame3DForm): IGame3D {

        let originalScene: IScene3D;
        let isThemed: boolean;
        const tempDifferences: [string, number][] = [];
        if ( form.objectType === GEOMETRIC_TYPE_NAME ) {
            originalScene = this.generateObjGeometricScene(form.objectQty);
            isThemed = false;
        } else if ( form.objectType === THEMATIC_TYPE_NAME) {
            originalScene = this.generateObjThematicScene(form.objectQty);
            isThemed = true;
        } else {
            throw new TYPE_ERROR("The type chosen for the new 3D game is not valid.");
        }

        return {
            name: form.name,
            id: (new ObjectID()).toHexString(),
            originalScene: originalScene,
            modifiedScene: this.game3DModificator.createModifScene(originalScene, form.objectType, form.modifications, tempDifferences),
            solo: this.top3RandomOrder(),
            multi: this.top3RandomOrder(),
            isThemed: isThemed,
            differencesIndex: tempDifferences,
        };
    }

    private generateObjGeometricScene(quantity: number): IScene3D {
        let backGroundColor: number = 0;
        const objects: IObjet3D[] = [];
        const newScene: IScene3D = {
            objects: objects,
            backColor: backGroundColor,
            };

        for (let i: number = 0; i < quantity; i++) {
            const obj: IObjet3D = this.objectGenerator.generateRandomGeometricObject(objects);
            newScene.objects.push(obj);
            do  {
                backGroundColor = this.objectGenerator.randomInt(this.PALE_COLOR, MAX_COLOR); // we go for pale colors
            } while (!this.game3DModificator.isEnoughContrast(backGroundColor, (objects[i] as IShape3D).color));
        }

        return newScene;
    }
    private generateObjThematicScene(quantity: number): IScene3D {
        const backGroundColor: number = 0; // no specific background color needed, using a skybox
        const objects: IObjet3D[] = [];
        const newScene: IScene3D = {
            objects: objects,
            backColor: backGroundColor,
            };

        const knigthsNb: number = this.objectGenerator.randomInt(0, this.MAX_KNIGHTS * quantity);
        this.objectGenerator.addRandomThematicObject("knight", knigthsNb, objects);

        const benchsNb: number = this.objectGenerator.randomInt(0, this.MAX_BENCH * quantity);
        this.objectGenerator.addRandomThematicObject("bench", benchsNb, objects);

        const dragonsNb: number = this.objectGenerator.randomInt(0, this.MAX_DRAGONS * quantity);
        this.objectGenerator.addRandomThematicObject("dragon", dragonsNb, objects);

        const balistasNb: number = this.objectGenerator.randomInt(0, this.MAX_BALISTAS * quantity);
        this.objectGenerator.addRandomThematicObject("balista", balistasNb, objects);

        const rocksNb: number = this.objectGenerator.randomInt(0, this.MAX_ROCKS * quantity);
        this.objectGenerator.addRandomThematicObject("rock", rocksNb, objects);

        const horsesNb: number = this.objectGenerator.randomInt(0, this.MAX_HORSES * quantity);
        this.objectGenerator.addRandomThematicObject("horse", horsesNb, objects);

        const treeNb: number = quantity - objects.length; // remaining objects are trees.
        this.objectGenerator.addRandomThematicObject("tree1", treeNb, objects);

        return newScene;

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
