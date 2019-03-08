import { Injectable } from "@angular/core";
import GLTFLoader from "three-gltf-loader";
import { IObjet3D } from "../../../../../../../common/models/objet3D";

@Injectable()
export class MedievalObjectService {

  private modelsLoader: GLTFLoader = new GLTFLoader();

  private loadedObjects: Map<string, THREE.Object3D>;

  public createObject(object: IObjet3D): THREE.Object3D {
    if (!this.loadedObjects.get(object.type) === undefined) {
      this.modelsLoader.load("../../assets/" + object.type + ".gltf",
                             (gltf) => {
          this.loadedObjects.set(object.type, gltf.scene.children[0]);

          return this.setPositionParameters(gltf.scene.children[0].clone(), object);
        }
      );
      // TODO: throw an error, use the error callback in the loader 
      return null;
    } else {
      return this.setPositionParameters(this.loadedObjects.get(object.type).clone(), object);
    }
  }

  private setPositionParameters(object: THREE.Object3D, parameters: IObjet3D): THREE.Object3D {

    object.scale.set(parameters.size, parameters.size, parameters.size);

    object.position.setX(parameters.position.x);
    object.position.setY(parameters.position.y);
    object.position.setZ(parameters.position.z);

    object.rotateX(parameters.rotation.x);
    object.rotateY(parameters.rotation.y);
    object.rotateZ(parameters.rotation.z);

    return object;

  }
}
