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
  // example of objects to add in a game
  private chest: IObjet3D;
  private tree1: IObjet3D;
  private tree2: IObjet3D;
  private rock: IObjet3D;
  private guard: IObjet3D;

  private skyBoxLoader: THREE.TextureLoader = new THREE.TextureLoader();
  private forestSize: number = 60;
  private skyBoxURLs: string[] = [
    "assets/clouds/right.png",
    "assets/clouds/left.png",
    "assets/clouds/top.png",
    "assets/clouds/bottom.png",
    "assets/clouds/back.png",
    "assets/clouds/front.png",
  ];

  private textureLoader: THREE.TextureLoader;

  public constructor(private medievalService: MedievalObjectService) {
    this.castle = {
      type: "castle",
      color: 0x000000,
      texture: "",
      position: { x: 0, y: 0, z: 0},
      size: 0.015,
      rotation: {x: 0, y: 0, z: 0},
    };
    // here are some examples for the games, the castle will always be there, but those are objects that 
    // could move, rotate, etc according to what the game generator gave us
    this.chest = {
      type: "chest",
      color: 0x000000,
      texture: "",
      position: { x: 2, y: 0.5, z: 0},
      size: 1,
      rotation: {x: 0, y: 0, z: 0},
    };
    this.tree1 = {
      type: "tree1",
      color: 0x000000,
      texture: "",
      position: { x: 5, y: 0.5, z: 20},
      size: 0.03,
      rotation: {x: 0, y: 0, z: 0},
    };
    this.tree2 = {
      type: "tree2",
      color: 0x000000,
      texture: "",
      position: { x: 10, y: 0, z: 10},
      size: 0.5,
      rotation: {x: 0, y: 0, z: 0},
    };
    this.rock = {
      type: "rock",
      color: 0x000000,
      texture: "",
      position: { x: 10, y: 1, z: 8},
      size: 0.1,
      rotation: {x: 0, y: 0, z: 0},
    };
    this.guard = {
      type: "guard",
      color: 0x000000,
      texture: "",
      position: { x: 3, y: 0, z: 5},
      size: 0.02,
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

    const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.forestSize, this.forestSize, this.forestSize);
    const skyMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materialArray);
    const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.sceneRef.add(skyBox);
  }

  private createFloor(): void {
    // TODO: might be cool to implement an algorithm to have some hills / mountains
    // found some algorithms but it would require complex functions... check if cool enough
    // for the complexity it adds

    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.forestSize, this.forestSize);
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
    this.medievalService.createObject(this.chest).then((castle: THREE.Object3D) => {
      this.sceneRef.add(castle);
    });
    this.medievalService.createObject(this.tree1).then((castle: THREE.Object3D) => {
      this.sceneRef.add(castle);
    });
    this.medievalService.createObject(this.tree2).then((castle: THREE.Object3D) => {
      this.sceneRef.add(castle);
    });
    this.medievalService.createObject(this.rock).then((castle: THREE.Object3D) => {
      this.sceneRef.add(castle);
    });
    this.medievalService.createObject(this.guard).then((castle: THREE.Object3D) => {
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
