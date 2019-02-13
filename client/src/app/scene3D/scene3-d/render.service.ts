import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { Game3D } from "../../../../../common/models/game3D"
import { Objet3D } from "../../../../../common/models/objet3D"
import { GameService } from 'src/app/services/game.service';
import { SocketService } from 'src/app/services/socket.service';
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";

// import Stats = require('stats.js');

@Injectable()
export class RenderService {

  constructor(private gameService: GameService, private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.UPDATE_FREE_GAMES, this.getGames.bind(this));
  };

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  // private stats: Stats;
  public games: Game3D[];

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ = 400;

  private light: THREE.Light;
  
  private initSize = 50;

  private fieldOfView = 75;

  private nearClippingPane = 1;

  private farClippingPane = 3000;

  public map: Map<string, THREE.Mesh>;
  
  public getGames(): void {
    this.gameService.getFreeGames()
        .subscribe((response: Game3D[]) => this.games = response);
  }
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

    const geometry = new THREE.BoxGeometry(this.initSize, this.initSize, this.initSize);

    const cube = new THREE.Mesh(geometry);
 
    this.map.set("cube", cube);
  }

  private createCylindre() {

    const geometry = new THREE.CylinderGeometry(this.initSize, this.initSize);

    const cylindre = new THREE.Mesh(geometry);

    this.map.set("cylinder", cylindre);
  }
  private createTetrahedron() {
    
    const geometry = new THREE.TetrahedronGeometry(this.initSize);

    const tetrahedron = new THREE.Mesh(geometry);
    
    this.map.set("tetrahedron", tetrahedron);
  }
  private createSphere() {
    
    const geometry = new THREE.SphereGeometry(this.initSize);

    const sphere = new THREE.Mesh(geometry);
    
    this.map.set("sphere", sphere);
  }
  private createCone() {
    
    const geometry = new THREE.ConeGeometry(this.initSize, this.initSize, 50);

    const cone = new THREE.Mesh(geometry);
    
    this.map.set("cone", cone);
  }

  private createScene() {
    /* Scene */
    this.scene = new THREE.Scene();
    this.light = new THREE.DirectionalLight(0xffffff, 1.0);
    this.light.position.set(1000,100,0);
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
   
    this.gameService.getFreeGames()
        .subscribe((response: Game3D[]) => this.games = response);
    
    const scen: Game3D = this.games[1];
    this.createScene();
    this.createCamera();

    this.scene.background = new THREE.Color(scen.backColor);

    for(let j = 0; j < scen.objects.length; j++ ) {
      this.createShape(scen.objects[j]);
    }
   
    this.initStats();
    // console.log(this.scene);
    this.startRenderingLoop();
  }

  public random(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  }
}
