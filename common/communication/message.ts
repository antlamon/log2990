export interface Message {
    title: string;
    body: string;
}
export const ERROR_ID: string = "error";
export const BASE_ID:string = "base";

export interface NewGameMessage {
    originalImagePath: string;
    modifiedImagePath: string;
    differenceImagePath: string;
    gameRoomId: string;
    username: string;
}

export interface Point {
    x: number;
    y: number;
}

export interface GameRoomUpdate {
    username: string;
    differenceCount: number;
    newImage: string;
}