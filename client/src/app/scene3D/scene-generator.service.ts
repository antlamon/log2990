import { Injectable } from "@angular/core";
import { MAX_COLOR, IObjet3D } from "../../../../common/models/objet3D";
import * as THREE from "three";
import { ShapeCreatorService } from "./scene3-d/shape-creator.service";
import { IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../common/models/game3D";
@Injectable({
  providedIn: "root"
})
export class SceneGeneratorService {
  private skyLight: number = 0x606060;
  private groundLight: number = 0x404040;

  public constructor(private shapeService: ShapeCreatorService) { }

  public async createScene(objects: IObjet3D[], color: number): Promise<THREE.Scene> {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(color);

    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    let light: THREE.Light;
    light = new THREE.DirectionalLight( MAX_COLOR );
    light.position.set( 0, 0, 1 );
    scene.add(light);
    this.shapeService.resetPromises();

    return Promise.all(this.shapeService.generateGeometricScene(objects)).then((objectsRes: THREE.Mesh[]) => {
      for (const obj of objectsRes) {
        scene.add(obj);
      }

      return scene;
    });

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
    const object: THREE.Mesh = await this.shapeService.createShape(diffObj.object);
    object.name = diffObj.name;
    scene.add(object);
  }

  private async modifyObject(scene: THREE.Scene, diffObj: IDifference): Promise<void> {
    const originalMesh: THREE.Mesh = (scene.getObjectByName(diffObj.name) as THREE.Mesh);
    const newMesh: THREE.Mesh = await this.shapeService.createShape(diffObj.object);
    originalMesh.material = newMesh.material;
  }

  private deleteObject(scene: THREE.Scene, name: string): void {
    scene.getObjectByName(name).visible = false;
  }
}