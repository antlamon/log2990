import { ITop3 } from "./top3";

export interface IGame {
    name: String;
    imageURL: String;
    solo: ITop3;
    multi: ITop3;
}
