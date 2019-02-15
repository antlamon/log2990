import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Game3D } from "../../../../../common/models/game3D"
import { Objet3D } from "../../../../../common/models/objet3D"

// import Stats = require('stats.js');

@Injectable()
export class RenderService {

  public static readonly NB_SEGMENTS: number = 50; //to have circular originalObjects

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  // private stats: Stats;


  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ = 500;

  private light: THREE.Light;
  
  private initSize = 20;

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
    shape.material = new THREE.MeshPhongMaterial({color: obj.color }); 
    this.scene.add(shape);
  }
  
  private createCube() {

    const geometry = new THREE.BoxGeometry(this.initSize, this.initSize, this.initSize);

    const cube = new THREE.Mesh(geometry);
 
    this.map.set("cube", cube);
  }

  private createCylindre() {

    const geometry = new THREE.CylinderGeometry(this.initSize, this.initSize, this.initSize, RenderService.NB_SEGMENTS);

    const cylindre = new THREE.Mesh(geometry);

    this.map.set("cylinder", cylindre);
  }
  private createTetrahedron() {
    
    const geometry = new THREE.TetrahedronGeometry(this.initSize);

    const tetrahedron = new THREE.Mesh(geometry);
    
    this.map.set("tetrahedron", tetrahedron);
  }
  private createSphere() {
    
    const geometry = new THREE.SphereGeometry(this.initSize, RenderService.NB_SEGMENTS,RenderService.NB_SEGMENTS);

    const sphere = new THREE.Mesh(geometry);
    
    this.map.set("sphere", sphere);
  }
  private createCone() {
    
    const geometry = new THREE.ConeGeometry(this.initSize, this.initSize, RenderService.NB_SEGMENTS);

    const cone = new THREE.Mesh(geometry);
    
    this.map.set("cone", cone);
  }

  private createScene(scene: Game3D) {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(scene.backColor);
    this.createCamera();
    this.scene.add( new THREE.HemisphereLight( 0x606060, 0x404040 ) );
    this.light = new THREE.DirectionalLight( 0xffffff );
    this.light.position.set( 0, 0, 1 );
    this.scene.add(this.light);

  }
  private createCamera() {
    /* Camera */
    const aspectRatio = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
    );
    this.camera.position.z = this.cameraZ;
    this.scene.add(this.camera);

  }

  private getAspectRatio() {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private startRenderingLoop() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
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

  public initialize(container: HTMLDivElement, scen: Game3D) {
    
    this.container = container;

    this.generateMap();

    this.createScene(scen);
    console.log(scen);

    for(let j = 0; j < scen.originalObjects.length; j++ ) {
      this.createShape(scen.originalObjects[j]);
    }
   
    this.initStats();
    this.startRenderingLoop();
  }

  public random(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  }
}
