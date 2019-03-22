import { IObjet3D } from "./objet3D";
import { IScore } from "./top3";

export interface IGame3D {

    name: string;
    id: string;
    originalScene: IObjet3D[];
    solo: IScore[];
    multi: IScore[];
    differences: IDifference[];
    isThematic: boolean;
    backColor: number;
}
export interface IDifference{
    type: string;
    object?: IObjet3D;
    name: string;
}
export const GEOMETRIC_TYPE_NAME: string = "geometric";
export const THEMATIC_TYPE_NAME: string = "thematic";
export const NO_MIN_OBJECTS: number = 10;
export const NO_MAX_OBJECTS: number = 200;
export const MODIFIED: string = "mod";
export const ORIGINAL: string = "original";