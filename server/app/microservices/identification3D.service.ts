import { IDifference } from "../../../common/models/game3D";

export class Identification3DService {

    public constructor(private differences: IDifference[]) {
    }

    public getDifference(objName: string): {name: string, type: string} {

        for (let i: number = 0; i < this.differences.length; i++) {
            if  (this.differences[i].name === objName) {

              const type: string =  this.differences[i].type;
              this.differences.splice(i, 1);

              return {name: objName, type: type};
            }
        }

        return {name: "", type: ""};
    }
}
