import { IGame3D } from "../../../common/models/game3D";

export class Identification3DService {

    public constructor(private game: IGame3D) {
    }
    //TODO: implement with correct structure
    public getDifference(objName: string): string {

        for (const obj of this.game.originalScene.objects) {
            if (obj.type === objName) {
                return objName;
            }
        }

        return "TODO";
    }
}
