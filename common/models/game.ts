import { ITop3 } from "./top3";

export interface IGame {
    id: number;
    name: string;
    originalImageURL: string;
    modifiedImageURL: string;
    solo: ITop3;
    multi: ITop3;
}

export interface ISimpleForm {
    id: number;
    name: string;
    originalImage: File;
    modifiedImage: File;
}
export interface IGame3DForm {
    name: string;
    objectType: string;
    objectQty: number;
    modifications: {add: boolean, delete: boolean, color: boolean}; 
}
