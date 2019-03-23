import { IDifference } from "../../../common/models/game3D";

export class Identification3DService {

    public constructor(private differences: IDifference[]) {
    }

    public getDifference(objName: string): string {

        for (let i: number = 0; i < this.differences.length; i++) {
            if  (this.differences[i].name === objName) {
              this.differences.splice(i, 1);

              return objName;
            }
        }

        return "TODO";
    }
}
