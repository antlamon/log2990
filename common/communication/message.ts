import { IDifference } from "../models/game3D";
import { IScore } from "../models/top3";

export interface Message {
    title: string;
    body: string;
}

export interface Message3D {
    title: string;
    body: {name: string; type: string; };
}

export const ERROR_ID: string = "error";
export const BASE_ID:string = "base";
export const SIMPLE_GAME_TYPE: string = "simple";
export const FREE_GAME_TYPE:string = "free";

export interface INewGameMessage {
    gameId: string;
    gameName: string;
    username: string;
    is3D: boolean;
    gameRoomId?: string;
}

export interface NewGameMessage extends INewGameMessage{
    originalImage: string;
    modifiedImage: string;
    differenceImage: string;
}
export interface NewGame3DMessage extends INewGameMessage{
    differences: IDifference[];
}


export interface Point {
    x: number;
    y: number;
}

interface IGameRoomUpdate {
    username: string;
    differencesFound: number;
    isGameOver: boolean;
}

export interface GameRoomUpdate extends IGameRoomUpdate {
    newImage: string;
}
export interface Game3DRoomUpdate extends IGameRoomUpdate {
    objName: string;
    diffType: string;
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
}

export interface EndGameMessage {
    username: string;
    score: string;
    gameId: string;
    gameType: string;
    gameRoomId: string;
}

export interface IScoreUpdate {
    id: string;
    gameType: string;
    solo: IScore[] | null;
    multi: IScore[] | null;
}

export interface ScoreUpdate extends IScoreUpdate {
    insertPos: number;
}

export interface NewScoreUpdate {
    scoreUpdate: ScoreUpdate;
    username: string;
    gameMode: string;
    gameName: string;
}