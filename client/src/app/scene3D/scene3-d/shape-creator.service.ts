import { Injectable } from "@angular/core";
import { IObjet3D, INITIAL_OBJECT_SIZE } from "../../../../../common/models/objet3D";
import * as THREE from "three";

@Injectable({
  providedIn: "root"
})
export class ShapeCreatorService {

  private map: Map<string, THREE.Mesh>;
  private textureLoader: THREE.TextureLoader;
  public readonly NB_SEGMENTS: number = 50; // to have circular originalObjects
  public promisedObjects: Promise<THREE.Mesh>[];

  public constructor() {
    THREE.Cache.enabled = true;
    this.promisedObjects = [];
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
  public resetPromises(): void {
    this.promisedObjects = [];
  }
  public generateGeometricScene(objects: IObjet3D[]): Promise<THREE.Mesh>[] {
    for (const obj of objects) {
       this.promisedObjects.push(this.createShape(obj));
    }

    return this.promisedObjects;
  }

  public createShape(obj: IObjet3D): Promise<THREE.Mesh> {

    const shape: THREE.Mesh = this.map.get(obj.type).clone();

    shape.name = obj.name;
    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
    shape.scale.set(obj.size, obj.size, obj.size);
    shape.rotation.x = obj.rotation.x;
    shape.rotation.y = obj.rotation.y;
    shape.rotation.z = obj.rotation.z;
    shape.material = obj.color !== 0 ?
      new THREE.MeshPhongMaterial({color: obj.color }) :
      new THREE.MeshPhongMaterial({map: this.textureLoader.load(("assets/" + obj.texture + ".jpg")) });

    return Promise.resolve(shape);
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
