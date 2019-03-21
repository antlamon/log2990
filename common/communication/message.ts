import { IGame3D } from "../models/game3D";

export interface Message {
    title: string;
    body: string;
}
export const ERROR_ID: string = "error";
export const BASE_ID:string = "base";

export interface INewGameMessage {
    gameRoomId: string;
    username: string;
    is3D: boolean;
}

export interface NewGameMessage extends INewGameMessage{
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
}
export interface NewGame3DMessage extends INewGameMessage{
    game: IGame3D;
}

export interface Point {
    x: number;
    y: number;
}

export interface GameRoomUpdate {
    username: string;
    differencesFound: number;
    newImage: string;
}

export interface Game3DRoomUpdate {
    username: string;
    differencesFound: number;
    objName: string;
}

export interface clickMessage {
    username: string;
    gameRoomId: string;
}
export interface ImageClickMessage extends clickMessage {
    point: Point;
}
export interface Obj3DClickMessage extends clickMessage {
    name: string;
    game: IGame3D;
}