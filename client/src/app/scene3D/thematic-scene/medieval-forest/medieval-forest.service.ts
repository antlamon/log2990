import * as THREE from "three";
import { MedievalObjectService } from "./medieval-objects/medieval-object.service";
import { Injectable } from "@angular/core";
import { IObjet3D } from "../../../../../../common/models/objet3D";

@Injectable()

export class MedievalForestService {

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

  private promises: Promise<void>[];

  public constructor(private medievalService: MedievalObjectService) {
    this.promises = [];
    this.castleWorld = {
      type: "castleWorld",
      position: { x: 0, y: 0, z: 0 },
      size: 1,
      rotation: { x: 0, y: 0, z: 0 },
    };
  }
  public getPromises(): Promise<void>[] {
    return this.promises;
  }

  public createForest(scene: THREE.Scene, obj: IObjet3D[]): void {
    this.sceneRef = scene;
    this.createSkyBox();
    this.createFloor();
    this.buildWorld();
    this.addGameObjects(obj);
  }
  private createSkyBox(): void {
    this.textureLoader = new THREE.TextureLoader();
    const faceNb: number = 6;
    const materialArray: THREE.MeshBasicMaterial[] = [];

    for (let i: number = 0; i < faceNb; i++) {
      this.promises.push( new Promise( (resolve, reject) => {
          materialArray[i] = new THREE.MeshBasicMaterial({
            map: this.skyBoxLoader.load(this.skyBoxURLs[i], () => resolve()),
            side: THREE.BackSide
          });
        })
      );
    }

    const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.skyBoxSize, this.skyBoxSize, this.skyBoxSize);
    const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, materialArray);
    this.sceneRef.add(skyBox);
  }

  private createFloor(): void {
    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.forestSize, this.forestSize);
    // tslint:disable-next-line:no-magic-numbers
    geometry.rotateX(-Math.PI / 2);
    let material: THREE.MeshPhongMaterial;
    this.promises.push( new Promise( (resolve, reject) => {
      material = new THREE.MeshPhongMaterial({
        map: this.textureLoader.load(("assets/" + "grass.jpg"), () => resolve())
      });
    }));
    const floor: THREE.Mesh = new THREE.Mesh(geometry, material);

    this.sceneRef.add(floor);
  }

  private buildWorld(): void {
    this.medievalService.createWorld(this.castleWorld).then((world: THREE.Object3D) => {
      this.sceneRef.add(world);
    });
  }

  private addGameObjects(objects: IObjet3D[]): void {
      for (const game of objects) {
        this.promises.push(this.medievalService.createObject(game).then((obj: THREE.Object3D) => {
          this.sceneRef.add(obj);
        }));
      }
  }

}
