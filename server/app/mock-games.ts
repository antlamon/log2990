import { IGame } from "../../common/models/game";
import { PATHS } from "./path";
export const SIMPLEGAMES: IGame[] = [
    { name: "Mock Simple Game", imageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp", solo: { first: 9997, second: 9998, third: 9999 }, multi: { first: 9997, second: 9998, third: 9999 } }];
export const FREEGAMES: IGame[] = [
    { name: "Mock Free Game", imageURL: PATHS.MOCK_IMAGES_PATH + "mockSimple.bmp", solo: { first: 9997, second: 9998, third: 9999 }, multi: { first: 9997, second: 9998, third: 9999 } }];
