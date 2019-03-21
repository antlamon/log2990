import { IObjet3D } from "./objet3D";
import { ITop3 } from "./top3";

export interface IGame3D {

    name: string;
    id: string;
    originalScene: IScene3D;
    modifiedScene: IScene3D;
    solo: ITop3;
    multi: ITop3;
    isThemed: boolean;

}

export interface IScene3D {
    objects: IObjet3D[];
    backColor: number;
}
export const MOCK_THEMED_GAME: IGame3D  = {
    name: "MOCKGAME",
    id: "0",
    originalScene: {
        objects: [
            {
                type: "knight",
                position: { x: 20, y: 0, z: -20},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "rock",
                position: { x: 10, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "dragon",
                position: { x: 15, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
        
        ],
        backColor: 0xFFFFFF,
    },
    modifiedScene: {
        objects: [
            {
                type: "knight",
                position: { x: 20, y: 0, z: -20},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "rock",
                position: { x: 10, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "dragon",
                position: { x: 15, y: 0, z: -15},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
            {
                type: "balista",
                position: { x: 10, y: 0, z: -10},
                size: 1,
                rotation: { x: 0, y: 0, z: 0},
            },
        
        ],
        backColor: 0xFFFFFF,
    },
    solo: {} as ITop3,
    multi: {} as ITop3,
    isThemed: true,
}
export const GEOMETRIC_TYPE_NAME: string = "geometric";
export const THEMATIC_TYPE_NAME: string = "thematic";
export const NO_MIN_OBJECTS: number = 10;
export const NO_MAX_OBJECTS: number = 200;