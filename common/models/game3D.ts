import {Objet3D} from "./objet3D";

export interface Game3D{

    name: string,
    numObj: number,
    objects: Objet3D[]
    backColor: number,

}