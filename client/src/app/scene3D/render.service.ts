import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../common/models/game3D";
import { SceneGeneratorService } from "./scene-generator.service";
import { AXIS, SQUARE_BOX_LENGHT, SKY_BOX_WIDTH, SKY_BOX_HEIGHT, SKY_BOX_DEPTH, FLOOR_LEVEL } from "../global/constants";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 150;
  private readonly GAMMA_FACTOR: number = 2.2;
  private readonly SENSITIVITY: number = 0.002;
  private readonly CAMERA_RADIUS_COLLISION: number = 0.2;
  private readonly FIELD_OF_VIEW: number = 75;
  private readonly NEAR_CLIPPING_PLANE: number = 1;
  private readonly FAR_CLIPPING_PLANE: number = 3000;
  private readonly CAMERA_Z: number = 20;
  private readonly CAMERA_Y: number = 5;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2;
  private raycaster: THREE.Raycaster;
  private isThematic: boolean;
  private rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;
  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;

  private hitboxes: [string, THREE.Box3][];
  private differencesObjects: THREE.Object3D[];
  private timeOutDiff: NodeJS.Timeout;
  private diffAreVisible: boolean;

  public constructor(private sceneGenerator: SceneGeneratorService) {
  }

  public async initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): Promise<void> {
    THREE.Cache.enabled = true;
    clearInterval(this.timeOutDiff);
    this.containerOriginal = containerO;
    this.isThematic = game.isThematic;
    this.diffAreVisible = true;
    this.mouse = new THREE.Vector2();
    this.sceneOriginal = await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic, game.differences);
    this.containerModif = containerM;
    this.sceneModif = this.isThematic ? await this.sceneGenerator.createScene(
      game.originalScene, game.backColor, this.isThematic, game.differences) :
        await this.sceneGenerator.modifyScene(this.sceneOriginal.clone(true), game.differences);
    if (this.isThematic ) {
      this.sceneModif = await this.sceneGenerator.modifyScene(this.sceneModif, game.differences);
    }
    this.createCamera();
    this.rendererO = this.createRenderer(this.containerOriginal);
    this.rendererM = this.createRenderer(this.containerModif);
    this.setCollidableObjects(game.differences);
    this.setFlashingObjs(game.differences);
  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererO.setSize(this.containerOriginal.clientWidth, this.containerOriginal.clientHeight);
  }

  public async getImageURL(game: IGame3D): Promise<string> {
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      this.FIELD_OF_VIEW, window.innerWidth / window.innerHeight, this.NEAR_CLIPPING_PLANE, this.FAR_CLIPPING_PLANE);
    camera.position.z = this.CAMERA_Z;
    camera.position.y = this.CAMERA_Y;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.hidden = true;
    const scene: THREE.Scene = await this.sceneGenerator.createScene(game.originalScene, game.backColor, game.isThematic, game.differences);
    renderer.render(scene, camera);

    return renderer.domElement.toDataURL();
  }
  private createCamera(): void {
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.FIELD_OF_VIEW,
      aspectRatio,
      this.NEAR_CLIPPING_PLANE,
      this.FAR_CLIPPING_PLANE
      );
    this.camera.rotation.order = "YXZ";
    this.camera.position.z = this.CAMERA_Z;
    this.camera.position.y = this.CAMERA_Y;
    this.sceneOriginal.add(this.camera);
    this.sceneModif.add(this.camera);
  }
  private getAspectRatio(): number {
    return this.containerOriginal.clientWidth / this.containerOriginal.clientHeight;
  }

  public startRenderingLoop(): void {
    this.raycaster = new THREE.Raycaster();
    this.render();
  }
  private setCollidableObjects(differences: IDifference[]): void {
    this.hitboxes = [];
    this.differencesObjects = [];
    this.sceneModif.children.forEach((obj: THREE.Object3D) => {
        this.hitboxes.push( [obj.name, new THREE.Box3().setFromObject(obj)]);
    });
    for (const diff of differences) {
      if (diff.type === ADD_TYPE) {
        this.hitboxes.push( [diff.name, new THREE.Box3().setFromObject(this.getObject(this.sceneOriginal, diff.name))]);
      }
    }
  }
  private setFlashingObjs(differences: IDifference[]): void {
    for (const diff of differences) {
      switch (diff.type) {
        case DELETE_TYPE:
          this.differencesObjects.push(this.getObject(this.sceneOriginal, diff.name));
          break;
        case ADD_TYPE:
          this.differencesObjects.push(this.getObject(this.sceneModif, diff.name));
          break;
        case MODIFICATION_TYPE:
          this.differencesObjects.push(this.getObject(this.sceneOriginal, diff.name));
          this.differencesObjects.push(this.getObject(this.sceneModif, diff.name));
          break;
        default:
      }
    }
  }
  private createRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    const renderer: THREE.WebGLRenderer = this.initializeRenderer(container);
    container.appendChild(renderer.domElement);

    return renderer;
  }
  public addListener(command: string, func: EventListenerOrEventListenerObject): void {
    this.rendererO = this.addListenToRender(this.rendererO, command, func);
    this.rendererM = this.addListenToRender(this.rendererM, command, func);
  }

  private addListenToRender(renderer: THREE.WebGLRenderer, command: string, func: EventListenerOrEventListenerObject): THREE.WebGLRenderer {
    renderer.domElement.addEventListener(command, func, false);

    return renderer;
  }
  private initializeRenderer(container: HTMLDivElement): THREE.WebGLRenderer {
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    // tslint:disable-next-line:deprecation
    renderer.gammaFactor = this.GAMMA_FACTOR;
    renderer.gammaOutput = true;

    return renderer;
  }
  private render(): void {
    requestAnimationFrame(() => this.render());
    this.rendererO.render(this.sceneOriginal, this.camera);
    this.rendererM.render(this.sceneModif, this.camera);
  }
  public rotateCam(angle: number, mouvement: number): void {
    switch (angle) {
      case AXIS.X: this.camera.rotation.x -= mouvement * this.SENSITIVITY;
                   break;
      case AXIS.Y: this.camera.rotation.y -= mouvement * this.SENSITIVITY;
                   break;
      default: break;
    }
  }
  public moveCam(axis: number, mouvement: number): void {
    switch (axis) {
      case AXIS.X: this.camera.translateX(mouvement);
                   while (this.isUnautorisedMove()) {
                      this.camera.translateX(-mouvement);
                    }
                   break;
      case AXIS.Z:  this.camera.translateZ(mouvement);
                    while (this.isUnautorisedMove()) {
                      this.camera.translateZ(-mouvement);
                    }
                    break;
      default: break;
    }
  }
  private isUnautorisedMove(): boolean {

    return this.detectCollision() || this.detectOutOfBox();
  }
  private detectOutOfBox(): boolean {

    const pos: THREE.Vector3 = this.camera.position.clone().applyQuaternion(this.sceneOriginal.quaternion);

    return this.outOfOneSide(pos.x, SKY_BOX_WIDTH)
    || this.outOfOneSide(pos.y, SKY_BOX_HEIGHT, FLOOR_LEVEL)
    || this.outOfOneSide(pos.z, SKY_BOX_DEPTH);
  }
  private outOfOneSide(pos: number, max: number, min?: number): boolean {

    if (!min || !this.isThematic) {
      if (!this.isThematic) {
        max = SQUARE_BOX_LENGHT;
      }
      min = -max;
    }

    return pos < min || pos > max;
  }
  private detectCollision(): boolean {
    const sphere: THREE.Sphere = new THREE.Sphere(this.camera.position.clone(), this.CAMERA_RADIUS_COLLISION);
    let coll: boolean = false;
    for (const box of this.hitboxes) {
      if (box[1].intersectsSphere(sphere)) {
        coll = true;
        break;
      }
    }

    return coll;
  }

  public identifyDiff(event: MouseEvent): THREE.Object3D {
    this.changeVisibilityOfDifferencesObjects(true);
    if ( event.clientX < this.containerModif.offsetLeft) {
      this.calculateMouse(event, this.containerOriginal);
    } else {
      this.calculateMouse(event, this.containerModif);
    }
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children.concat(this.sceneOriginal.children),
                                                                              true);
    if (intersects.length > 0) {
      let objet: THREE.Object3D = intersects[0].object;
      while (!this.isObjet(objet.name)) {
        objet = objet.parent;
      }

      return objet;
    }

    return null;

  }
  private isObjet(name: string): boolean {
    return +name >= 0;
  }
  private getObject(scene: THREE.Scene, objName: string): THREE.Object3D {
    return scene.getObjectByName(objName);
  }

  public removeDiff(objName: string, type: string): void {
    switch (type) {
      case ADD_TYPE: this.sceneModif.remove(this.getObject(this.sceneModif, objName));
                     this.hitboxes = this.hitboxes.filter((box: [string, THREE.Box3]) => box[0] !== objName);
                     break;
      case MODIFICATION_TYPE: this.changeVisibilityOfDifferencesObjects(true);
                              this.removeModif(objName);
                              break;
      case DELETE_TYPE:
                        this.getObject(this.sceneModif, objName).visible = true;
                        break;
      default: return;
    }
    this.changeVisibilityOfDifferencesObjects(true);
    this.differencesObjects = this.differencesObjects.filter((obj: THREE.Object3D) => obj.name !== objName);
  }
  private removeModif(objName: string): void {
    if (this.isThematic) {
      this.sceneModif.remove(this.getObject(this.sceneModif, objName));
      this.sceneModif.add(this.getObject(this.sceneOriginal, objName).clone());
    } else {
      (this.getObject(this.sceneModif, objName) as THREE.Mesh).material
        = (this.getObject(this.sceneOriginal, objName) as THREE.Mesh).material;
    }
  }
  private calculateMouse(event: MouseEvent, container: HTMLDivElement): void {
    const MULTI: number = 2;
    this.mouse.x = (event.offsetX  / container.offsetWidth) * MULTI - 1;
    this.mouse.y = -(event.offsetY / container.offsetHeight) * MULTI + 1;
  }
  public startCheatMode(): void {
    this.timeOutDiff = setInterval(this.flashObjects.bind(this), this.FLASH_TIME);
  }
  public stopCheatMode(): void {
    clearInterval(this.timeOutDiff);
    this.changeVisibilityOfDifferencesObjects(true);
  }
  private flashObjects(): void {
   this.diffAreVisible = !this.diffAreVisible;
   this.changeVisibilityOfDifferencesObjects(this.diffAreVisible);
  }
  private changeVisibilityOfDifferencesObjects(visible: boolean): void {
    this.differencesObjects.forEach((obj: THREE.Mesh) => {
        obj.visible = visible;
    });
  }
}
