import * as THREE from "three";
import { IGame3D } from "../../../../common/models/game3D";
import { IObjet3D } from "../../../../common/models/objet3D";

export interface ISceneContainer {
    containerO: HTMLDivElement;
    containerM: HTMLDivElement;
    game: IGame3D;

    addLightToScene(scene: THREE.Scene): void;
    addObjectsToScene(scene: THREE.Scene, obj: IObjet3D[]): void;
}
