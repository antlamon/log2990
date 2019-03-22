import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../../common/models/game3D";
import { MAX_COLOR, IObjet3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import { CLICK, KEYS } from "src/app/global/constants";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 200;
  private readonly FLASH_COLOR: number = 0xFFFFFF;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;
  private isGame: boolean;
  private cheatModeActivated: boolean;

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

  private differences: IDifference[];
  private timeOutDiff: NodeJS.Timeout;
  private diffAreVisible: boolean;

  public constructor(private shapeService: ShapeCreatorService) {}

  public initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): void {
    clearInterval(this.timeOutDiff);
    this.containerOriginal = containerO;
    this.differences = game.differences;
    this.diffAreVisible = true;
    this.sceneOriginal = this.createScene(game.originalScene, game.backColor);
    this.cheatModeActivated = false;
    if (containerM !== null) {
      this.isGame = true;
      this.containerModif = containerM;
      this.sceneModif = this.modifyScene(this.sceneOriginal.clone(), game.differences);
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
  private modifyScene(scene: THREE.Scene, diffObjs: IDifference[]): THREE.Scene {

    for (const diff of diffObjs) {
      this.addModification(scene, diff);
    }

    return scene;
  }

  private addModification(scene: THREE.Scene, diffObj: IDifference): void {

    switch (diffObj.type) {
      case ADD_TYPE:
        this.addObject(scene, diffObj);
        break;
      case MODIFICATION_TYPE:
        this.modifyObject(scene, diffObj);
        break;
      case DELETE_TYPE:
        this.deleteObject(scene, diffObj.name);
        break;
      default: break;
    }
  }
  private addObject(scene: THREE.Scene, diffObj: IDifference): void {
    const object: THREE.Mesh = this.shapeService.createShape(diffObj.object);
    object.name = diffObj.name;
    scene.add(object);
  }

  private modifyObject(scene: THREE.Scene, diffObj: IDifference): void {
    (scene.getObjectByName(diffObj.name) as THREE.Mesh).material = this.shapeService.createShape(diffObj.object).material;
  }

  private deleteObject(scene: THREE.Scene, name: string): void {
    scene.getObjectByName(name).visible = false;
  }

  private createScene(objects: IObjet3D[], color: number): THREE.Scene {
    /* Scene */
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(color);

    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    this.light = new THREE.DirectionalLight( MAX_COLOR );
    this.light.position.set( 0, 0, 1 );
    scene.add(this.light);

    for (const obj of objects) {
      const object: THREE.Mesh = this.shapeService.createShape(obj);
      object.name = obj.name;
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

    for (const diff of this.differences) {
      if (diff.type !== ADD_TYPE) {
        ((this.sceneOriginal.getObjectByName(diff.name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive
           = new THREE.Color(visible ? 0 : 0xffffff);
      }
      if (diff.type !== DELETE_TYPE) {
        ((this.sceneModif.getObjectByName(diff.name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive
           = new THREE.Color(visible ? 0 : this.FLASH_COLOR);
      }
    }
  }
}
