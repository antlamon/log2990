// tslint:disable:max-line-length
import { IGame } from "../../common/models/game";
import { PATHS } from "./path";
export const SIMPLEGAMES: IGame[] = [{ 
    id: 999, 
    name: "Mock Simple Game", 
    originalImageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp", 
    modifiedImageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp",
    solo: { first: 9997, second: 9998, third: 9999 }, 
    multi: { first: 9997, second: 9998, third: 9999 } 
}];

export const FREEGAMES: IGame[] = [{ 
    id: 999, 
    name: "Mock Free Game", 
    originalImageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp", 
    modifiedImageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp",
    solo: { first: 9997, second: 9998, third: 9999 }, 
    multi: { first: 9997, second: 9998, third: 9999 } 
}];
