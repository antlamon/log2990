export interface Objet3D {
    type: string,
    color: number,
    texture: string,
    position: { x: number, y: number, z: number},
    size: number,
    rotation: {x: number, y: number, z: number}
}

export const INITIAL_OBJECT_SIZE: number = 20;
export const MAX_COLOR: number = 0xFFFFFF;