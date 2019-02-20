import { Injectable } from "@angular/core";
import * as THREE from "three";
import { Scene3D } from "../../../../../common/models/game3D";
import { Objet3D, INITIAL_OBJECT_SIZE, MAX_COLOR } from "../../../../../common/models/objet3D";

// import Stats = require('stats.js');

@Injectable()
export class RenderService {

  public static readonly NB_SEGMENTS: number = 50; // to have circular originalObjects

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  // private stats: Stats;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ: number = 500;

  private light: THREE.Light;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private farClippingPane: number = 3000;

  public map: Map<string, THREE.Mesh>;

  private generateMap(): void {
    this.map = new Map();
    this.createCube();
    this.createCone();
    this.createSphere();
    this.createCylindre();
    this.createTetrahedron();
  }

  private createShape(obj: Objet3D): void {

    const shape: THREE.Mesh = this.map.get(obj.type).clone();

    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
    shape.scale.set(obj.size, obj.size, obj.size);
    shape.rotation.x = obj.rotation.x;
    shape.rotation.y = obj.rotation.y;
    shape.rotation.z = obj.rotation.z;
    shape.material = new THREE.MeshPhongMaterial({color: obj.color });
    this.scene.add(shape);
  }

  private createCube(): void {

    const geometry: THREE.Geometry = new THREE.BoxGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE);

    const cube: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cube", cube);
  }

  private createCylindre(): void {

    const geometry: THREE.Geometry = new THREE.CylinderGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE
                                                              , RenderService.NB_SEGMENTS);

    const cylindre: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cylinder", cylindre);
  }
  private createTetrahedron(): void {

    const geometry: THREE.Geometry = new THREE.TetrahedronGeometry(INITIAL_OBJECT_SIZE);

    const tetrahedron: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("tetrahedron", tetrahedron);
  }
  private createSphere(): void {

    const geometry: THREE.Geometry = new THREE.SphereGeometry(INITIAL_OBJECT_SIZE, RenderService.NB_SEGMENTS, RenderService.NB_SEGMENTS);

    const sphere: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("sphere", sphere);
  }
  private createCone(): void {

    const geometry: THREE.Geometry = new THREE.ConeGeometry(INITIAL_OBJECT_SIZE, INITIAL_OBJECT_SIZE, RenderService.NB_SEGMENTS);

    const cone: THREE.Mesh = new THREE.Mesh(geometry);

    this.map.set("cone", cone);
  }

  private createScene(scene: Scene3D): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(scene.backColor);
    this.createCamera();
    const skyLight: number = 0x606060;
    const groundLight: number = 0x404040;
    this.scene.add( new THREE.HemisphereLight( skyLight, groundLight ) );
    this.light = new THREE.DirectionalLight( MAX_COLOR );
    this.light.position.set( 0, 0, 1 );
    this.scene.add(this.light);

  }
  private createCamera(): void {
    /* Camera */
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = this.cameraZ;
    this.scene.add(this.camera);

  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  private render(): void {
    requestAnimationFrame(() => this.render());

    this.renderer.render(this.scene, this.camera);
    // this.stats.update();
  }

  private initStats(): void {
    // this.stats = new Stats();
    // this.stats.dom.style.position = 'absolute';

    // this.container.appendChild(this.stats.dom);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public initialize(container: HTMLDivElement, scen: Scene3D): void {

    this.container = container;

    this.generateMap();
    this.createScene(scen);

    for (const obj of scen.objects) {
      this.createShape(obj);
    }

    this.initStats();
    this.startRenderingLoop();
  }

  public random(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  }
}
