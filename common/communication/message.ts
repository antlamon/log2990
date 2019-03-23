export interface Message {
    title: string;
    body: string;
}
export const ERROR_ID: string = "error";
export const BASE_ID:string = "base";
export const SIMPLE_GAME_TYPE: string = "simple";
export const FREE_GAME_TYPE:string = "free";

export interface NewGameMessage {
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

export interface ImageClickMessage {
    username: string;
    gameRoomId: string;
    point: Point;
}