import { ITop3 } from "./top3";

export interface IGame {
    id: number;
    name: string;
    imageURL: string;
    solo: ITop3;
    multi: ITop3;
}

export interface ISimpleForm {
    id: number;
    name: string;
    originalImage: File;
    modifiedImage: File;
}
