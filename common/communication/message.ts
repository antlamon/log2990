import { IGame3D } from "../models/game3D";

export interface Message {
    title: string;
    body: string;
}
export const ERROR_ID: string = "error";
export const BASE_ID:string = "base";

export interface NewGameMessage {
    gameRoomId: string;
    username: string;
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
}
export interface NewGame3DMessage {
    gameRoomId: string;
    username: string;
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
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