import { ITop3 } from "./top3";

export interface IGame {
    name: string;
    imageURL: string;
    solo: ITop3;
    multi: ITop3;
}
