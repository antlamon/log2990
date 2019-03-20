import { Injectable } from "@angular/core";
import { INITIAL_OBJECT_SIZE, IShape3D } from "../../../../../common/models/objet3D";
import * as THREE from "three";

@Injectable({
  providedIn: "root"
})
export class ShapeCreatorService {

  private map: Map<string, THREE.Mesh>;
  private textureLoader: THREE.TextureLoader;
  public readonly NB_SEGMENTS: number = 50; // to have circular originalObjects

  public constructor() {
    this.generateMap();
    this.textureLoader = new THREE.TextureLoader();
  }
  private generateMap(): void {
    this.map = new Map();
    this.createCube();
    this.createCone();
    this.createSphere();
    this.createCylindre();
    this.createTetrahedron();
  }

  public createShape(obj: IShape3D): THREE.Mesh {

    const shape: THREE.Mesh = this.map.get(obj.type).clone();

    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
    shape.scale.set(obj.size, obj.size, obj.size);
    shape.rotation.x = obj.rotation.x;
    shape.rotation.y = obj.rotation.y;
    shape.rotation.z = obj.rotation.z;
    shape.material = obj.color !== 0 ?
      new THREE.MeshPhongMaterial({color: obj.color }) :
      new THREE.MeshPhongMaterial({map: this.textureLoader.load(("assets/" + "marble1" + ".jpg")) });

    return shape;
  }

  private createCube(): void {

    const geometry: THREE.Geometry = new THREE.BoxGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE);

    const cube: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cube", cube);
  }

  private createCylindre(): void {

    const geometry: THREE.Geometry = new THREE.CylinderGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE
                                                              , this.NB_SEGMENTS);

    const cylindre: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cylinder", cylindre);
  }
  private createTetrahedron(): void {

    const geometry: THREE.Geometry = new THREE.TetrahedronGeometry(INITIAL_OBJECT_SIZE);

    const tetrahedron: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("tetrahedron", tetrahedron);
  }
  private createSphere(): void {

    const geometry: THREE.Geometry = new THREE.SphereGeometry(INITIAL_OBJECT_SIZE, this.NB_SEGMENTS, this.NB_SEGMENTS);

    const sphere: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("sphere", sphere);
  }
  private createCone(): void {

    const geometry: THREE.Geometry = new THREE.ConeGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, this.NB_SEGMENTS);

    const cone: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cone", cone);
  }

}
