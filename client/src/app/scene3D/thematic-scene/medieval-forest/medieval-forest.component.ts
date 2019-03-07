import { Component } from "@angular/core";
import * as THREE from "three";

@Component({
  selector: "app-medieval-forest",
  templateUrl: "./medieval-forest.component.html",
  styleUrls: ["./medieval-forest.component.css"]
})
export class MedievalForestComponent extends THREE.Object3D {

  private sceneRef: THREE.Scene;

  private forestWidth: number = 60;
  private forestDepth: number = 60;
  private textureLoader: THREE.TextureLoader;

  public constructor(scene: THREE.Scene) {
    super();
    this.sceneRef = scene;
    this.textureLoader = new THREE.TextureLoader();

    this.createFloor();

  }

  private createFloor(): void {
    // TO DO: might be cool to implement an algorithm to have some hills / mountains
    // found some algorithms but it would require complexe functions... check if cool enough
    // for the complexity it adds

    const geometry: THREE.PlaneGeometry = new THREE.PlaneGeometry(this.forestWidth, this.forestDepth);
    // tslint:disable-next-line:no-magic-numbers
    geometry.rotateX(-Math.PI / 2);
    let material: THREE.MeshPhongMaterial;
    material = new THREE.MeshPhongMaterial({map: this.textureLoader.load(("assets/" + "grass.jpg")) });
    const floor: THREE.Mesh = new THREE.Mesh(geometry, material);

    this.sceneRef.add(floor);
  }

  private addCastle(): void {

  }

}
