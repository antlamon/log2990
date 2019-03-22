import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IScene3D, MODIFIED, ORIGINAL } from "../../../../../common/models/game3D";
import { MAX_COLOR, IShape3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import { CLICK, KEYS } from "src/app/global/constants";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 125;

  private containerOriginal: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;

  private cheatModeActivated: boolean;

  private rendererO: THREE.WebGLRenderer;

  private sceneOriginal: THREE.Scene;

  private cameraZ: number = 500;

  private light: THREE.Light;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private movementSpeed: number = 3;
  private farClippingPane: number = 3000;

  private skyLight: number = 0x606060;
  private groundLight: number = 0x404040;

  private differencesIndex: [string, number][] = [];
  private timeOutDiff: NodeJS.Timeout;
  private diffAreVisible: boolean;

  public constructor(private shapeService: ShapeCreatorService) {}

  public initialize(containerO: HTMLDivElement, iScene: IScene3D): void {

    this.containerOriginal = containerO;
    // this.differencesIndex = iScene.differencesIndex;
    this.diffAreVisible = true;
    this.sceneOriginal = this.createScene(iScene);
    this.cheatModeActivated = false;

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

    let index: number = 0;
    for (const obj of iScene.objects) {
      const object: THREE.Mesh = this.shapeService.createShape(obj as IShape3D);
      object.name = index.toString();
      scene.add(object);
      index++;
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
  }

  private getAspectRatio(): number {
    return window.innerWidth / window.innerHeight;
  }

  private startRenderingLoop(): void {

    document.addEventListener( "keydown", this.onKeyDown, false );

    this.rendererO = this.createRenderer(this.containerOriginal);
    this.containerOriginal.appendChild(this.rendererO.domElement);
    this.render();
  }

  private createRenderer(container: HTMLDivElement): THREE.WebGLRenderer {

    const renderer: THREE.WebGLRenderer = this.initializeRenderer(container);

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
    renderer.setSize(window.innerWidth, window.innerHeight);

    return renderer;
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.rendererO.domElement.style.width = "100%";
    this.rendererO.domElement.style.height = "100%";
    this.rendererO.render(this.sceneOriginal, this.camera);
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
      case KEYS["T"]:
        this.cheatModeActivated = !this.cheatModeActivated;
        if (this.cheatModeActivated) {
          this.startCheatMode();
        } else {
          this.stopCheatMode();
        }
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
  private startCheatMode(): void {
    this.timeOutDiff = setInterval(this.flashObjects.bind(this), this.FLASH_TIME);
  }
  private stopCheatMode(): void {
    clearInterval(this.timeOutDiff);
    this.changeVisibilityOfDifferencesObjects(true);
  }
  private flashObjects(): void {
   this.diffAreVisible = !this.diffAreVisible;
   this.changeVisibilityOfDifferencesObjects(this.diffAreVisible);
  }
  private changeVisibilityOfDifferencesObjects(visible: boolean): void {

    for (const diff of this.differencesIndex) {
      if (diff[0] === ORIGINAL) {
       // this.sceneOriginal.getObjectByName(diff[1].toString()).visible = visible;
      }
      if (diff[0] === MODIFIED) {
       // this.sceneModif.getObjectByName(diff[1].toString()).visible = visible;
      }
    }
  }
}
