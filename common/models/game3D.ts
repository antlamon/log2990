import {Objet3D} from "./objet3D";
import { ITop3 } from "./top3";

export interface Game3D{

    name: string,
    id: number,
    numObj: number,
    originalObjects: Objet3D[],
    modifiedObjects: Objet3D[],
    backColor: number,
    solo: ITop3,
    multi: ITop3

}
export const GEOMETRIC_TYPE_NAME: string = "geometric";
export const THEMATIC_TYPE_NAME: string = "thematic";