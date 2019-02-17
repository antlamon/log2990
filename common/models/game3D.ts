import {Objet3D} from "./objet3D";
import { ITop3 } from "./top3";

export interface Game3D{

    name: string,
    id: number,
    originalScene: Scene3D,
    modifiedScene: Scene3D,
    solo: ITop3,
    multi: ITop3

}

export interface Scene3D{
    modified: boolean,
    numObj: number,
    objects: Objet3D[],
    backColor: number
}