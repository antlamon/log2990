import { ITop3 } from "./top3";

export interface IGame {
    id: string,
    name: string;
    originalImage: string;
    solo: ITop3;
    multi: ITop3;
}

export interface ISimpleForm {
    name: string;
    originalImage: File;
    modifiedImage: File;
}
export interface IFullGame {
    card: IGame;
    modifiedImage: string;
    differenceImage: string;
}
export interface IGame3DForm {
    name: string;
    objectType: string;
    objectQty: number;
    modifications: {add: boolean, delete: boolean, color: boolean}; 
}
