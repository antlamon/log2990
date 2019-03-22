export interface IObjet3D {
    type: string;
    position: { x: number; y: number; z: number};
    size: number;
    rotation: {x: number; y: number; z: number};
}
export interface IShape3D extends IObjet3D {
    color: number;
}
export interface IModel3D extends IObjet3D {
    texture: string;
}

export const INITIAL_OBJECT_SIZE: number = 20;
export const INITIAL_MODELS_SIZE: number = 2;
export const MAX_COLOR: number = 0xFFFFFF;