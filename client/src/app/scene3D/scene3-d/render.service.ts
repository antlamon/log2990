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

  private light: THREE.Light;
  
  private init = 50;

  private fieldOfView = 75;

  private nearClippingPane = 1;

  private farClippingPane = 3000;

  public map: Map<string, THREE.Mesh>;

  private generateMap() {
    this.map = new Map();
    this.createCube();
    this.createCone();
    this.createSphere();
    this.createCylindre();
    this.createTetrahedron();
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
    shape.material = new THREE.MeshBasicMaterial({ polygonOffset: true, polygonOffsetFactor: 1, polygonOffsetUnits:1, color: obj.color });
    this.scene.add(shape);
  }
  
  private createCube() {

    const geometry = new THREE.BoxGeometry(this.init, this.init, this.init);

    const cube = new THREE.Mesh(geometry);
 
    this.map.set("cube", cube);
  }

  private createCylindre() {

    const geometry = new THREE.CylinderGeometry(this.init, this.init);

    const cylindre = new THREE.Mesh(geometry);

    this.map.set("cylindre", cylindre);
  }
  private createTetrahedron() {
    
    const geometry = new THREE.TetrahedronGeometry(this.init);

    const tetrahedron = new THREE.Mesh(geometry);
    
    this.map.set("tetrahedron", tetrahedron);
  }
  private createSphere() {
    
    const geometry = new THREE.SphereGeometry(this.init);

    const sphere = new THREE.Mesh(geometry);
    
    this.map.set("sphere", sphere);
  }
  private createCone() {
    
    const geometry = new THREE.ConeGeometry(this.init, this.init, 50);

    const cone = new THREE.Mesh(geometry);
    
    this.map.set("cone", cone);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.light = new THREE.DirectionalLight(0xffffff, 1.0);
    this.light.position.set(1000,100,0);
    this.scene.add(this.light);
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

  public initialize(container: HTMLDivElement) {
    
    this.container = container;
    
    this.generateMap();
    const scen: Game3D = {
      name: "newFKGSCENE", 
      backColor: 0x0FFFF1, 
      numObj: 1, 
      objects: [],
      solo: {first:222, second: 223, third: 21312},
      multi: {first:222, second: 223, third: 21312},
    };

    this.createScene();
    this.scene.background = new THREE.Color(scen.backColor);
    const noObj: number = Math.floor(this.random(10,200));
    for(let i = 0; i < noObj; i++) {
      const obj: Objet3D = {type: "cube",
        color: 0xFF0000,
        position: { x: this.random(-300,300), y: this.random(-300,300), z: this.random(-300,300)},
        size: 0.5,
        rotation: {x: this.random(0,360), y: this.random(0,360), z: this.random(0,360)}};
      let valid: Boolean = true;
      for(let i = 0; i < scen.objects.length; i++) {
        if(Math.pow(scen.objects[i].position.x-obj.position.x,2)+ Math.pow(obj.position.y-scen.objects[i].position.y,2) + Math.pow(obj.position.z-scen.objects[i].position.z,2)
          < Math.pow(43,2)) {
          valid = false;
          }
      }
      if(valid) {
        scen.objects.push(obj);

        this.createShape(obj);
      }
    }
    
    this.initStats();
    // console.log(this.scene);
    this.startRenderingLoop();
  }

  public random(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  }
}
