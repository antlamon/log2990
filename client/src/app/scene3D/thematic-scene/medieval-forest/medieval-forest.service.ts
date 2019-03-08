import * as THREE from "three";
import { IScene3D } from "../../../../../../common/models/game3D";
import { MedievalObjectService } from "./medieval-objects/medieval-object.service";
import { Injectable } from "@angular/core";
import { IObjet3D } from "../../../../../../common/models/objet3D";

@Injectable()

export class MedievalForestService {

  private sceneRef: THREE.Scene;
  private gameRef: IScene3D;
  private castle: IObjet3D;

  private skyBoxLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private skyBoxSize: number = 300;
  private skyBoxURLs: string[] = [
    "assets/clouds/right.png",
    "assets/clouds/left.png",
    "assets/clouds/top.png",
    "assets/clouds/bottom.png",
    "assets/clouds/back.png",
    "assets/clouds/front.png",
  ];

  private forestWidth: number = 60;
  private forestDepth: number = 60;
  private textureLoader: THREE.TextureLoader;

  public constructor(private medievalService: MedievalObjectService) {
    this.castle = {
      type: "castle",
      color: 0x000000,
      texture: "",
      position: { x: 0, y: 0, z: 0},
      size: 0.005,
      rotation: {x: 0, y: 0, z: 0},
    };
  }

  public createForest(scene: THREE.Scene, game: IScene3D): void {
    this.sceneRef = scene;
    this.gameRef = game;
    this.createSkyBox();
    this.createFloor();
    this.addCastle();
    if (this.gameRef) {
      this.addGameObjects();
    }
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
    // TODO: might be cool to implement an algorithm to have some hills / mountains
    // found some algorithms but it would require complex functions... check if cool enough
    // for the complexity it adds

    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.forestWidth, this.forestDepth);
    // tslint:disable-next-line:no-magic-numbers
    geometry.rotateX(-Math.PI / 2);
    let material: THREE.MeshPhongMaterial;
    material = new THREE.MeshPhongMaterial({ map: this.textureLoader.load(("assets/" + "grass.jpg")) });
    const floor: THREE.Mesh = new THREE.Mesh(geometry, material);

    this.sceneRef.add(floor);
  }

  private addCastle(): void {
    this.medievalService.createObject(this.castle).then((castle: THREE.Object3D) => {
      this.sceneRef.add(castle);
    });
  }

  private addGameObjects(): void {
    for (const game of this.gameRef.objects) {
      this.medievalService.createObject(game).then((obj: THREE.Object3D) => {
        this.sceneRef.add(obj);
      });
    }
  }

}
