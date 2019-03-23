import { IObjet3D } from "./objet3D";
import { IScore } from "./top3";

export const ADD_TYPE: string = "ADD";
export const DELETE_TYPE: string = "DELETE";
export const MODIFICATION_TYPE: string = "MODIF";
export const GEOMETRIC_TYPE_NAME: string = "geometric";
export const THEMATIC_TYPE_NAME: string = "thematic";
export const NO_MIN_OBJECTS: number = 10;
export const NO_MAX_OBJECTS: number = 200;
export const MODIFIED: string = "mod";
export const ORIGINAL: string = "original";
export interface IGame3D {

    name: string;
    id: string;
    originalScene: IObjet3D[];
    solo: IScore[];
    multi: IScore[];
    differences: IDifference[];
    isThematic: boolean;
    backColor: number;
}
export interface IDifference{
    type: string;
    object?: IObjet3D;
    name: string;
}
export const MOCK_THEMED_GAME: IGame3D  = {
    name: "MOCKGAME",
    id: "0",
    originalScene: 
     [
            {
                type: "knight",
                name: "1",
                position: { x: 20, y: 0, z: -20},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "rock",
                name: "2",
                position: { x: 10, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "dragon",
                name: "3",
                position: { x: 15, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                name: "4",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                name: "5",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },            {
                type: "balista",
                name: "6",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                name: "7",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },            {
                type: "balista",
                name: "8",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                name: "9",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
        
        ],
    solo: [],
    multi: [],
    differences: [
        {
            type: ADD_TYPE,
            object:             {
                type: "dragon",
                name: "9",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            name: "",
        },
        {
            type: ADD_TYPE,
            object:             {
                type: "rock",
                name: "9",
                position: { x: -10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            name: "",
        },
        {
            type: ADD_TYPE,
            object:             {
                type: "dragon",
                name: "",
                position: { x: -10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            name: "",
        },
    ],
    isThematic: true,
    backColor: 0,
};