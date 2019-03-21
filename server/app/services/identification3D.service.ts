import { IGame3D } from "../../../common/models/game3D";

export class Identification3DService {
 
    public constructor(private game: IGame3D) { }

    public getDifference(objName: string): string {

        return objName;
    }
}
