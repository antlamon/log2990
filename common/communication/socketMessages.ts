export interface NewGameMessage {
    originalImagePath: string;
    modifiedImagePath: string;
    differencesImagePath: string;
}

export interface Point {
    x: number;
    y: number;
}