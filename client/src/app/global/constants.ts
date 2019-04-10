export const BASE_SERVER_PATH: string = "http://localhost:3000/";
export const GAMES_LIST_PATH: string = "games";
export const INITIAL_PATH: string = "";
export const SIMPLE_GAME_PATH: string = "simple-game/";
export const FREE_GAME_PATH: string = "free-game/";
export const ADMIN_PATH: string = "admin";
export const WAITING_PATH: string = "waiting/";

export const SOUNDS_PATH: string = "assets/";
export const CORRECT_SOUND_PATH: string = SOUNDS_PATH + "correct.wav";
export const VICTORY_SOUND_PATH: string = SOUNDS_PATH + "Ta-Da.wav";
export const ERROR_SOUND_PATH: string = SOUNDS_PATH + "error.wav";

export interface KeysMap {
    [key: string]: number;
}

export enum AXIS {X, Y, Z}

export const KEYS: KeysMap = {"A": 65, "D": 68, "S": 83, "W": 87, "T": 84};

export const BLACK: number = 0x000000;
export const WHITE: number = 0xFFFFFF;

export enum CLICK {left, center, right}

export const SQUARE_BOX_LENGHT: number = 200;
export const SKY_BOX_HEIGHT: number = 100;
export const SKY_BOX_WIDTH: number = 90;
export const SKY_BOX_DEPTH: number = 140;
export const FLOOR_LEVEL: number = 1;
