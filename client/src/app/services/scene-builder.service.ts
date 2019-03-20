import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IScene3D } from "../../../../common/models/game3D";
import { CLICK, KEYS } from "src/app/global/constants";
import { ISceneContainer } from "../scene3D/ISceneContainer";

@Injectable()
export class SceneBuilderService {

  private gameContainer: ISceneContainer;

  private camera: THREE.PerspectiveCamera;

  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;

  public rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;

  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;

  private cameraZ: number = -20;
  private cameraY: number = 5;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private movementSpeed: number = 3;
  private farClippingPane: number = 3000;

  public initialize(caller: ISceneContainer): void {

    this.gameContainer = caller;
    const scene: THREE.Scene = this.createScene(caller.game.originalScene);
    this.sceneOriginal = scene;
    this.sceneModif = scene;
    //TODO: this.sceneModif.addModifications(); // a voir avec stephane
    this.createCamera();
    this.startRenderingLoop();

  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererO.setSize(this.gameContainer.containerO.clientWidth, this.gameContainer.containerO.clientHeight);
  }

  private createScene(iScene: IScene3D): THREE.Scene {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(iScene.backColor);

    this.gameContainer.addLightToScene(scene);

    this.gameContainer.addObjectsToScene(scene, iScene.objects);

    return scene;

  }
  private createCamera(): void {
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
      );
    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
    this.camera.rotation.y = -Math.PI;
    this.sceneOriginal.add(this.camera);
    this.sceneModif.add(this.camera);
  }

  private getAspectRatio(): number {
    return this.gameContainer.containerO.clientWidth / this.gameContainer.containerO.clientHeight;
  }

  private startRenderingLoop(): void {

    document.addEventListener( "keydown", this.onKeyDown, false );

    this.rendererO = this.createRenderer(this.gameContainer.containerO);
    this.rendererM = this.createRenderer(this.gameContainer.containerM);

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
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({
      preserveDrawingBuffer: true,
    });
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.BasicShadowMap;
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);

    return renderer;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());

    this.rendererO.render(this.sceneOriginal, this.camera);
    this.rendererM.render(this.sceneModif, this.camera);

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
