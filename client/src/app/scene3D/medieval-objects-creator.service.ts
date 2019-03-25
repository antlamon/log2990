import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IObjet3D } from "../../../../common/models/objet3D";
import GLTFLoader from "three-gltf-loader";

@Injectable()
export class MedievalObjectsCreatorService {

  private castleWorld: IObjet3D;

  private modelsLoader: GLTFLoader = new GLTFLoader();

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

  public constructor() {
    this.castleWorld = {
      name: "castle",
      type: "castleWorld",
      position: { x: 0, y: 0, z: 0 },
      size: 1,
      rotation: { x: 0, y: 0, z: 0 },
    };
  }

  public async createMedievalScene(objects: IObjet3D[]): Promise<THREE.Mesh[]> {
    const objectsTHREE: THREE.Mesh[] = [];
    for (const obj of objects) {
      objectsTHREE.push(await this.createObject(obj));
    }
    objectsTHREE.push(await this.createSkyBox());
    objectsTHREE.push(await this.createObject(this.castleWorld));

    return objectsTHREE;
  }

  public createObject(object: IObjet3D): Promise<THREE.Mesh> {

    return new Promise((resolve, reject) => {
      this.modelsLoader.load("../../assets/" + object.type + "/" + object.type + ".gltf",
                             (gltf) => {
          resolve(this.setPositionParameters(gltf.scene, object));
        }
      );
    });
  }
  private createSkyBox(): Promise<THREE.Mesh> {
    return new Promise<THREE.Mesh>((resolve, reject) => {
      this.skyBoxLoader = new THREE.TextureLoader();
      const faceNb: number = 6;
      const materialArray: THREE.MeshBasicMaterial[] = [];
      for (let i: number = 0; i < faceNb; i++) {
        materialArray[i] = new THREE.MeshBasicMaterial({
          map: this.skyBoxLoader.load(this.skyBoxURLs[i], () => {
            if (i === faceNb - 1) { // loading is now done for the whole box
              const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.skyBoxSize, this.skyBoxSize, this.skyBoxSize);
              const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, materialArray);
              resolve(skyBox);
            }
          }),
          side: THREE.BackSide
        });
      }
    });
  }

  private setPositionParameters(object: THREE.Object3D, parameters: IObjet3D): THREE.Mesh {

    object.scale.set(parameters.size, parameters.size, parameters.size);

    object.position.setX(parameters.position.x);
    object.position.setY(parameters.position.y);
    object.position.setZ(parameters.position.z);

    object.rotateX(parameters.rotation.x);
    object.rotateY(parameters.rotation.y);
    object.rotateZ(parameters.rotation.z);

    object.name = parameters.name;

    return object as THREE.Mesh;

  }

}
