import * as THREE from "three";
import { IScene3D } from "../../../../../../common/models/game3D";
import { MedievalObjectService } from "./medieval-objects/medieval-object.service";
import { Injectable } from "@angular/core";
import { IObjet3D } from "../../../../../../common/models/objet3D";

@Injectable()

export class MedievalForestService {

  private gameRef: IScene3D;

  private sceneRef: THREE.Scene;
  private castleWorld: IObjet3D;

  private skyBoxLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private forestSize: number = 60;
  private skyBoxSize: number = 300;
  private skyBoxURLs: string[] = [
    "assets/clouds/right.png",
    "assets/clouds/left.png",
    "assets/clouds/top.png",
    "assets/clouds/bottom.png",
    "assets/clouds/back.png",
    "assets/clouds/front.png",
  ];

  private textureLoader: THREE.TextureLoader;

  private promisedObjects: Promise<THREE.Object3D>[];

  public constructor(private medievalService: MedievalObjectService) {
    this.promisedObjects = [];
    this.castleWorld = {
      type: "castleWorld",
      position: { x: 0, y: 0, z: 0 },
      size: 1,
      rotation: { x: 0, y: 0, z: 0 },
    };
  }
  public getPromises(): Promise<THREE.Object3D>[] {
    return this.promisedObjects;
  }

  public createForest(scene: THREE.Scene, game: IScene3D): Promise<THREE.Object3D>[] {
    this.sceneRef = scene;
    this.gameRef = game;
    this.createSkyBox();
    this.createFloor();
    this.buildWorld();
    if (this.gameRef) {
      this.addGameObjects();
    }

    return this.promisedObjects;
  }
  private createSkyBox(): void {
    this.textureLoader = new THREE.TextureLoader();
    const faceNb: number = 6;
    const materialArray: THREE.MeshBasicMaterial[] = [];

    for (let i: number = 0; i < faceNb; i++) {
          materialArray[i] = new THREE.MeshBasicMaterial({
            map: this.skyBoxLoader.load(this.skyBoxURLs[i]),
            side: THREE.BackSide
          });
    }

    const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.skyBoxSize, this.skyBoxSize, this.skyBoxSize);
    const skyMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materialArray);
    const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.sceneRef.add(skyBox);
  }

  private createFloor(): void {
    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.forestSize, this.forestSize);
    // tslint:disable-next-line:no-magic-numbers
    geometry.rotateX(-Math.PI / 2);
    let material: THREE.MeshPhongMaterial;
    this.promisedObjects.push( new Promise( (resolve, reject) => {
      material = new THREE.MeshPhongMaterial({
        map: this.textureLoader.load(("assets/" + "grass.jpg"), () => resolve(new THREE.Mesh(geometry, material)))
      });
    }));
  }

  private buildWorld(): void {
   this.promisedObjects.push(this.medievalService.createWorld(this.castleWorld));
  }

  private addGameObjects(): void {
    for (const game of this.gameRef.objects) {
      this.promisedObjects.push(this.medievalService.createObject(game));
    }
  }

}
