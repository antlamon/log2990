import { Injectable } from "@angular/core";
import { IObjet3D } from "../../../../common/models/objet3D";
import * as THREE from "three";
import { ShapeCreatorService } from "./scene3-d/shape-creator.service";
import { IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../common/models/game3D";
import { MedievalObjectsCreatorService } from "./medieval-objects-creator.service";
import { WHITE } from "../global/constants";
@Injectable({
  providedIn: "root"
})
export class SceneGeneratorService {
  private skyLight: number = 0xF5F5F5;
  private groundLight: number = 0xF5F5F5;
  private isThematic: boolean;
  private textureLoader: THREE.TextureLoader;

  public constructor(private shapeService: ShapeCreatorService, private modelsService: MedievalObjectsCreatorService) {
    this.textureLoader = new THREE.TextureLoader();
   }

  public async createScene(objects: IObjet3D[], color: number, isThematic: boolean): Promise<THREE.Scene> {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(color);
    this.isThematic = isThematic;
    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    const light: THREE.DirectionalLight = new THREE.DirectionalLight( WHITE );
    light.position.set( 0, 0, 1 );
    scene.add(light);
    this.shapeService.resetPromises();
    if (this.isThematic) {
      const objectsRes: THREE.Mesh[] = await this.modelsService.createMedievalScene(objects);
      for (const obj of objectsRes) {
          scene.add(obj);
        }

      return scene;
    } else {
      return Promise.all(this.shapeService.generateGeometricScene(objects)).then((objectsRes: THREE.Mesh[]) => {
        for (const obj of objectsRes) {
          scene.add(obj);
        }

        return scene;
      });
    }

  }
  public modifyScene(scene: THREE.Scene, diffObjs: IDifference[]): THREE.Scene {
    for (const diff of diffObjs) {
      this.addModification(scene, diff);
    }

    return scene;
}
  private addModification(scene: THREE.Scene, diffObj: IDifference): void {
    switch (diffObj.type) {
      case ADD_TYPE:
        this.addObject(scene, diffObj);
        break;
      case MODIFICATION_TYPE:
        this.modifyObject(scene, diffObj);
        break;
      case DELETE_TYPE:
        this.deleteObject(scene, diffObj.name);
        break;
      default: break;
    }
}
  private async addObject(scene: THREE.Scene, diffObj: IDifference): Promise<void> {
    const object: THREE.Mesh = this.isThematic ?
      await this.modelsService.createObject(diffObj.object) :
      await this.shapeService.createShape(diffObj.object);
    scene.add(object);
  }

  private async modifyObject(scene: THREE.Scene, diffObj: IDifference): Promise<void> {
    const originalMesh: THREE.Mesh = (scene.getObjectByName(diffObj.name) as THREE.Mesh);
    const newMesh: THREE.Mesh = this.isThematic ?
      await this.modelsService.createObject(diffObj.object) :
      await this.shapeService.createShape(diffObj.object);
    if (this.isThematic) {
      newMesh.traverse((child) => {
        if ( child instanceof THREE.Mesh ) {
           const tex: THREE.Texture = this.textureLoader.load
           ("assets/" + diffObj.object.type + "/" + diffObj.object.texture, () => {
             tex.flipY = false;
             (child.material as THREE.MeshStandardMaterial).map = tex;
             tex.needsUpdate = true;
           });
        }
      });
      scene.remove(originalMesh);
      scene.add(newMesh);
    } else {
      originalMesh.material = newMesh.material;
    }
  }

  private deleteObject(scene: THREE.Scene, name: string): void {
    scene.getObjectByName(name).visible = false;
  }
}
