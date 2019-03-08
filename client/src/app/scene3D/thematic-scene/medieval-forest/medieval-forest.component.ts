import { Component } from "@angular/core";
import * as THREE from "three";
import GLTFLoader from "three-gltf-loader";

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
  private modelsLoader: GLTFLoader;

  public constructor(scene: THREE.Scene) {
    super();
    this.sceneRef = scene;
    this.modelsLoader = new GLTFLoader();
    this.textureLoader = new THREE.TextureLoader();

    this.createForest();

  }

  private createForest(): void {
    this.createFloor();
    this.addCastle();
  }

  private createFloor(): void {
    // TO DO: might be cool to implement an algorithm to have some hills / mountains
    // found some algorithms but it would require complexe functions... check if cool enough
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
    this.modelsLoader.load("../../assets/castle.gltf",
                           (gltf) => {
        gltf.scene.children[0].position.y = 0;
        gltf.scene.children[0].position.x = 0;
        gltf.scene.children[0].position.z = 0;
        gltf.scene.children[0].scale.set(0.005, 0.005, 0.005);
        this.sceneRef.add(gltf.scene.children[0]);
      },
      // called while loading is progressing
                           (xhr) => {
        console.log("loading castle: " + (xhr.loaded / xhr.total * 100) + "%");
        // could be sent as a message to user when message box is implemented
      }
    );
  }

}
