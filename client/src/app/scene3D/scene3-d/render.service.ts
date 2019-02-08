import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Game3D } from "../../../../../common/models/game3D"
import { Objet3D } from "../../../../../common/models/objet3D"
// import Stats = require('stats.js');

@Injectable()
export class RenderService {

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  // private stats: Stats;
  
  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ = 400;

  private fieldOfView = 70;

  private nearClippingPane = 1;

  private farClippingPane = 1000;

  public rotationSpeedX = 0.005;

  public rotationSpeedY = 0.01;

  public map: Map<string, THREE.Mesh>;

  private generateMap() {
    this.map = new Map();
    this.createCube();
    this.createCone();
  }

  private createShape(obj: Objet3D) {
    
    const shape: THREE.Mesh = this.map.get(obj.type).clone();
    shape.position.x = obj.position.x;
    shape.position.y = obj.position.y;
    shape.position.z = obj.position.z;
    shape.scale.set(obj.size,obj.size, obj.size);
    shape.rotation.x = obj.rotation.x;
    shape.rotation.y = obj.rotation.y;
    shape.rotation.z = obj.rotation.z;
    shape.material = new THREE.MeshBasicMaterial({ color: obj.color });
    this.scene.add(shape);
  }
  
  private createCube() {
    
    const init: number = 100;

    const geometry = new THREE.BoxGeometry(init, init, init);

    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    const cube = new THREE.Mesh(geometry, material);
    cube.position.x = 0;
    cube.position.y = 0;
    cube.position.z = 0;
    
    this.map.set("cube", cube);
  }
  private createCone() {
    
    const init: number = 100;

    const geometry = new THREE.ConeGeometry(init, init);

    const material = new THREE.MeshBasicMaterial({ color: 0xFFFFFF });

    const cone = new THREE.Mesh(geometry, material);
    
    this.map.set("cone", cone);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();

    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = this.cameraZ;
  }

  private getAspectRatio() {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  private render() {
    requestAnimationFrame(() => this.render());

    this.renderer.render(this.scene, this.camera);
    // this.stats.update();
  }


  private initStats() {
    // this.stats = new Stats();
    // this.stats.dom.style.position = 'absolute';

    // this.container.appendChild(this.stats.dom);
  }

  public onResize() {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public initialize(container: HTMLDivElement, rotationX: number, rotationY: number) {
    
    this.generateMap();
    const scen: Game3D = {backColor: 0x0FFFF1, numObj: 1, objects: [{type: "cone",
      color: 0xFF0000,
      position: { x: 5, y: 12, z: 3},
      size: 1.5,
      rotation: {x: 0, y: 0, z: 2}}] };
    
    //const intial: number = 10;

    this.container = container;
    this.rotationSpeedX = rotationX;
    this.rotationSpeedY = rotationY;


    this.createScene();
    this.scene.background = new THREE.Color(scen.backColor);
    
    this.createShape(scen.objects[0]);
    this.initStats();
    // console.log(this.scene);
    this.startRenderingLoop();
  }
}
