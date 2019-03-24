import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../../common/models/game3D";
import { MAX_COLOR, IObjet3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { CLICK, KEYS, WHITE } from "src/app/global/constants";
import { SocketService } from "src/app/services/socket.service";
import { Obj3DClickMessage, Game3DRoomUpdate, NewGame3DMessage } from "../../../../../common/communication/message";
import { IndexService } from "src/app/services/index.service";
//import { MedievalObjectsCreatorService } from "../medieval-objects-creator.service";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 200;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster;
  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;
  //private isThematic: boolean;
  private cheatModeActivated: boolean;
  private roomId: string;
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

  public constructor(private shapeService: ShapeCreatorService, private socket: SocketService, private index: IndexService,
    /*, private modelsService: MedievalObjectsCreatorService*/) {
    this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
    }

  public async initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): Promise<void> {

    clearInterval(this.timeOutDiff);
    this.roomId = game.id;
    this.containerOriginal = containerO;
    this.containerModif = containerM;
    this.differences = game.differences;
    this.diffAreVisible = true;
    this.sceneOriginal = await this.createScene(game.originalScene, game.backColor);
    this.sceneModif = this.modifyScene(this.sceneOriginal.clone(), game.differences);
    this.cheatModeActivated = false;
    const newGameMessage: NewGame3DMessage = {
      username: this.index.username,
      gameRoomId: this.roomId,
      is3D: true,
      differences: this.differences
    };
    this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);

    this.createCamera();
    this.startRenderingLoop();
  }
  private handleCreateGameRoom(rejection?: string): void {
    if (rejection !== null) {
        alert(rejection);
    }
  }
  private handleCheckDifference(update: Game3DRoomUpdate): void {
    if (update.differencesFound !== -1) {
      this.removeDiff(update.objName, update.diffType);
    }
  }
  public onDestroy(): void {
    this.socket.emitEvent(SocketsEvents.DELETE_GAME_3D_ROOM, this.roomId);
  }
  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.rendererO.setSize(this.containerOriginal.clientWidth, this.containerOriginal.clientHeight);
  }

  public async getImageURL(game: IGame3D): Promise<string> {
    const camera: THREE.PerspectiveCamera = new THREE.PerspectiveCamera(
      this.fieldOfView, window.innerWidth / window.innerHeight, this.nearClippingPane, this.farClippingPane);
    camera.position.z = this.cameraZ;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    this.sceneOriginal = await this.createScene(game.originalScene, game.backColor);
    renderer.render(this.sceneOriginal, camera);
    renderer.domElement.hidden = true;

    return renderer.domElement.toDataURL();
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
  private async addObject(scene: THREE.Scene, diffObj: IDifference): Promise<void> {
    const object: THREE.Mesh = await this.shapeService.createShape(diffObj.object);
    object.name = diffObj.name;
    scene.add(object);
  }

  private async modifyObject(scene: THREE.Scene, diffObj: IDifference): Promise<void> {
    const originalMesh: THREE.Mesh = (scene.getObjectByName(diffObj.name) as THREE.Mesh);
    const newMesh: THREE.Mesh = await this.shapeService.createShape(diffObj.object);
    originalMesh.material = newMesh.material;
  }

  private deleteObject(scene: THREE.Scene, name: string): void {
    scene.getObjectByName(name).visible = false;
  }

  private async createScene(objects: IObjet3D[], color: number): Promise<THREE.Scene> {
    const scene: THREE.Scene = new THREE.Scene();
    scene.background = new THREE.Color(color);

    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    this.light = new THREE.DirectionalLight( MAX_COLOR );
    this.light.position.set( 0, 0, 1 );
    scene.add(this.light);
    this.shapeService.resetPromises();

    return Promise.all(this.shapeService.generateGeometricScene(objects)).then((objectsRes: THREE.Mesh[]) => {
      for (const obj of objectsRes) {
        scene.add(obj);
      }

      return scene;
    });

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
    this.camera.rotation.order = "YXZ";
    this.camera.position.z = this.cameraZ;
    this.sceneOriginal.add(this.camera);
    this.sceneModif.add(this.camera);
  }

  private getAspectRatio(): number {
    return this.containerOriginal.clientWidth / this.containerOriginal.clientHeight;
  }

  private startRenderingLoop(): void {
    document.addEventListener( "keydown", this.onKeyDown, false );
    this.raycaster = new THREE.Raycaster();
    this.rendererO = this.createRenderer(this.containerOriginal);
    this.rendererM = this.createRenderer(this.containerModif);
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
    this.camera.rotation.y -= event.movementX * this.SENSITIVITY;
    this.camera.rotation.x -= event.movementY * this.SENSITIVITY;
  }
  private onMouseUp = (event: MouseEvent) => {

    switch (event.button) {
      case (CLICK.right):
        this.press = false;
        break;
      case (CLICK.left):
        this.identifyDiff(event);
        break;
      default:
    }
  }
  private onMouseDown = (event: MouseEvent) => {
    if (event.button === CLICK.right) {
      this.press = true;
    }
  }
  private identifyDiff(event: MouseEvent): void {
    if ( event.clientX < this.containerModif.offsetLeft) {
      this.calculateMouse(event, this.containerOriginal);
    } else {
      this.calculateMouse(event, this.containerModif);
    }
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children.concat(this.sceneOriginal.children));
    if (intersects.length > 0) {
      const objMessage: Obj3DClickMessage = {
        gameRoomId: this.roomId,
        username: this.index.username,
        name: intersects[0].object.name,
      };
      this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
    }
  }

  private removeDiff(objName: string, type: string): void {

    switch (type) {
      case ADD_TYPE: this.sceneModif.getObjectByName(objName).visible = false;
                     break;
      case MODIFICATION_TYPE: this.stopFlashObject(objName);
                              (this.sceneModif.getObjectByName(objName) as THREE.Mesh).material
        = (this.sceneOriginal.getObjectByName(objName) as THREE.Mesh).material;
                              break;
      case DELETE_TYPE: this.stopFlashObject(objName);
                        this.sceneModif.getObjectByName(objName).visible = true;
                        break;
      default: break;
    }
    this.soustractDiff(objName);
  }
  private soustractDiff(objName: string): void {
    for (let i: number = 0; this.differences.length; i++ ) {
      if (this.differences[i].name === objName) {
        this.differences.splice(i, 1);

        return;
      }
    }
  }
  private calculateMouse(event: MouseEvent, container: HTMLDivElement): void {
    const MULTI: number = 2;
    this.mouse.x = (event.offsetX  / container.offsetWidth) * MULTI - 1;
    this.mouse.y = -(event.offsetY / container.offsetHeight) * MULTI + 1;
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
           = new THREE.Color(visible ? 0 : WHITE);
      }
      if (diff.type !== DELETE_TYPE) {
        ((this.sceneModif.getObjectByName(diff.name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive
           = new THREE.Color(visible ? 0 : WHITE);
      }
    }
  }
  private stopFlashObject(name: string): void {
    ((this.sceneOriginal.getObjectByName(name) as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive = new THREE.Color(0);
  }
}
