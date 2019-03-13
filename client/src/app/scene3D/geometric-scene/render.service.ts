import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IScene3D, IGame3D } from "../../../../../common/models/game3D";
import { MAX_COLOR, IShape3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import { CLICK, KEYS } from "src/app/global/constants";

@Injectable()
export class RenderService {

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;
  private isGame: boolean;

  private rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;

  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;

  private cameraZ: number = 500;

  private light: THREE.Light;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private movementSpeed: number = 3;
  private farClippingPane: number = 3000;

  private skyLight: number = 0x606060;
  private groundLight: number = 0x404040;

  public constructor(private shapeService: ShapeCreatorService) { }

  public initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): void {

    this.containerOriginal = containerO;
    this.sceneOriginal = this.createScene(game.originalScene);

    if (containerM !== null) {
      this.isGame = true;
      this.containerModif = containerM;
      this.sceneModif = this.createScene(game.modifiedScene);
    } else {
      this.isGame = false;
    }

    this.createCamera();

    this.startRenderingLoop();
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererO.setSize(this.containerOriginal.clientWidth, this.containerOriginal.clientHeight);
  }

  private createScene(iScene: IScene3D): THREE.Scene {
    /* Scene */
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(iScene.backColor);

    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    this.light = new THREE.DirectionalLight( MAX_COLOR );
    this.light.position.set( 0, 0, 1 );
    scene.add(this.light);

    for (const obj of iScene.objects) {
      const object: THREE.Mesh = this.shapeService.createShape(obj as IShape3D);
      scene.add(object);
    }

    return scene;
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
    this.sceneOriginal.add(this.camera);
    if (this.sceneModif !== undefined) {
      this.sceneModif.add(this.camera);
    }
  }

  private getAspectRatio(): number {
    return this.containerOriginal.clientWidth / this.containerOriginal.clientHeight;
  }

  private startRenderingLoop(): void {

    document.addEventListener( "keydown", this.onKeyDown, false );

    this.rendererO = this.createRenderer(this.containerOriginal);
    if (this.isGame) {
      this.rendererM = this.createRenderer(this.containerModif);
    }
    this.render();
  }

  private createRenderer(container: HTMLDivElement): THREE.WebGLRenderer {

    const renderer: THREE.WebGLRenderer = this.initializeRenderer(container);
    container.appendChild(renderer.domElement);

    renderer.domElement.addEventListener( "mousemove", this.onMouseMove, false );
    renderer.domElement.addEventListener( "contextmenu", (event: MouseEvent) => { event.preventDefault(); }, false );
    renderer.domElement.addEventListener("mousedown", this.onMouseDown, false);
    renderer.domElement.addEventListener("mouseup", this.onMouseUp, false);

    return renderer;
  }

  private initializeRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    return renderer;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());

    this.rendererO.render(this.sceneOriginal, this.camera);
    if (this.isGame) {
      this.rendererM.render(this.sceneModif, this.camera);
    }
  }
  private onKeyDown = (event: KeyboardEvent) => {
    switch (event.keyCode ) {
      case KEYS["S"]: // up
      this.camera.translateZ(this.movementSpeed);
      break;
      case KEYS["W"]: // down
      this.camera.translateZ(-this.movementSpeed);
      break;
      case KEYS["D"]: // up
      this.camera.translateX(this.movementSpeed);
      break;
      case KEYS["A"]: // down
      this.camera.translateX(-this.movementSpeed);
      break;
      default: break;
    }
  }
  private onMouseMove = (event: MouseEvent) => {
    if (!this.press) { return; }

    // TODO: fix rotation after moving
    this.camera.rotation.y -= event.movementX * this.SENSITIVITY;
    this.camera.rotation.x -= event.movementY * this.SENSITIVITY;
  }
  private onMouseUp = (event: MouseEvent) => {
    if (event.button === CLICK.right) {
      this.press = false;
    }
  }
  private onMouseDown = (event: MouseEvent) => {
    if (event.button === CLICK.right) {
      this.press = true;
    }
  }
}
