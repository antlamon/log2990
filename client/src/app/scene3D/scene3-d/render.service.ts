import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IGame3D, IDifference, ADD_TYPE, MODIFICATION_TYPE, DELETE_TYPE } from "../../../../../common/models/game3D";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { CLICK, KEYS } from "src/app/global/constants";
import { SocketService } from "src/app/services/socket.service";
import { Obj3DClickMessage, Game3DRoomUpdate, NewGame3DMessage } from "../../../../../common/communication/message";
import { IndexService } from "src/app/services/index.service";
import { SceneGeneratorService } from "../scene-generator.service";

@Injectable()
export class RenderService {
  private readonly FLASH_TIME: number = 150;
  private readonly WHITE: number = 0xFFFFFF;

  private containerOriginal: HTMLDivElement;
  private containerModif: HTMLDivElement;
  private camera: THREE.PerspectiveCamera;
  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster;
  private readonly SENSITIVITY: number = 0.002;
  private press: boolean;
  private isThematic: boolean;
  private cheatModeActivated: boolean;
  private roomId: string;
  private rendererO: THREE.WebGLRenderer;
  private rendererM: THREE.WebGLRenderer;
  private sceneOriginal: THREE.Scene;
  private sceneModif: THREE.Scene;
  private readonly GAMMA_FACTOR: number = 2.2;

  private cameraZ: number = 20;
  private cameraY: number = 5;

  private fieldOfView: number = 75;
  private nearClippingPane: number = 1;
  private movementSpeed: number = 3;
  private farClippingPane: number = 3000;

  private differences: IDifference[];
  private timeOutDiff: NodeJS.Timeout;
  private diffAreVisible: boolean;

  public constructor(private sceneGenerator: SceneGeneratorService, private socket: SocketService, private index: IndexService) {
    this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
    }

  public async initialize(containerO: HTMLDivElement, containerM: HTMLDivElement, game: IGame3D): Promise<void> {

    clearInterval(this.timeOutDiff);
    this.roomId = game.id;
    this.containerOriginal = containerO;
    this.isThematic = game.isThematic;
    this.differences = game.differences;
    this.diffAreVisible = true;
    this.sceneOriginal = await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic);
    this.cheatModeActivated = false;
    this.containerModif = containerM;
    this.sceneModif = this.isThematic ? await this.sceneGenerator.createScene(game.originalScene, game.backColor, this.isThematic) :
     await this.sceneGenerator.modifyScene(this.sceneOriginal.clone(true), game.differences);
    if (this.isThematic ) {
      this.sceneModif = await this.sceneGenerator.modifyScene(this.sceneModif, game.differences);
    }
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
    camera.position.y = this.cameraY;
    const renderer: THREE.WebGLRenderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.body.appendChild(renderer.domElement);
    renderer.domElement.hidden = true;
    const scene: THREE.Scene = await this.sceneGenerator.createScene(game.originalScene, game.backColor, game.isThematic);
    renderer.render(scene, camera);

    return renderer.domElement.toDataURL();
    }
  private createCamera(): void {
    const aspectRatio: number = this.getAspectRatio();
    this.camera = new THREE.PerspectiveCamera(
      this.fieldOfView,
      aspectRatio,
      this.nearClippingPane,
      this.farClippingPane
      );
    this.camera.rotation.order = "YXZ";
    this.camera.position.z = this.cameraZ;
    this.camera.position.y = this.cameraY;
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
    renderer.setPixelRatio(devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.gammaFactor = this.GAMMA_FACTOR;
    renderer.gammaOutput = true;

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
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children.concat(this.sceneOriginal.children),
                                                                              true);
    if (intersects.length > 0) {
      let objet: THREE.Object3D = intersects[0].object;
      while (!this.isObjet(objet.name)) {
        objet = objet.parent;
      }

      const objMessage: Obj3DClickMessage = {
        gameRoomId: this.roomId,
        username: this.index.username,
        name: objet.name,
      };
      this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
    }
  }
  private isObjet(name: string): boolean {
    return +name >= 0;
  }

  private removeDiff(objName: string, type: string): void {

    switch (type) {
      case ADD_TYPE: this.sceneModif.remove(this.sceneModif.getObjectByName(objName));
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
        this.sceneOriginal.getObjectByName(diff.name).traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).material) {
            ((obj as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive =
            new THREE.Color(visible ? 0 : this.WHITE);
          }
        });
      }
      if (diff.type !== DELETE_TYPE) {
        this.sceneModif.getObjectByName(diff.name).traverse((obj: THREE.Object3D) => {
          if ((obj as THREE.Mesh).material) {
            ((obj as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive =
            new THREE.Color(visible ? 0 : this.WHITE);
          }
        });
      }
    }
  }
  private stopFlashObject(name: string): void {
    this.sceneOriginal.getObjectByName(name).traverse((obj: THREE.Object3D) => {
      if ((obj as THREE.Mesh).material) {
        ((obj as THREE.Mesh).material as THREE.MeshPhongMaterial).emissive =
        new THREE.Color(0);
      }
    });
  }
}
