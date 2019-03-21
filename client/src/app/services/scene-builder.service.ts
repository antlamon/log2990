import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IScene3D } from "../../../../common/models/game3D";
import { CLICK, KEYS } from "src/app/global/constants";
import { ISceneContainer } from "../scene3D/ISceneContainer";
import { SocketService } from "./socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { GameRoomUpdate, Obj3DClickMessage } from "../../../../common/communication/message";

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

  private mouse: THREE.Vector2 = new THREE.Vector2();
  private raycaster: THREE.Raycaster;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private movementSpeed: number = 3;
  private farClippingPane: number = 3000;
  public constructor(private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
  }

  public initialize(caller: ISceneContainer): void {

    this.gameContainer = caller;
    const scene: THREE.Scene = this.createScene(caller.game.originalScene);
    this.sceneOriginal = scene;
    this.sceneModif = scene.clone();
    //TODO: this.sceneModif.addModifications(); // a voir avec stephane
    this.createCamera();
    this.startRenderingLoop();

  }
  private handleCreateGameRoom(rejection?: string): void {
    if (rejection !== null) {
        alert(rejection);
    }
  }
  private handleCheckDifference(update: GameRoomUpdate): void {}

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
  private get containerOriginal(): HTMLDivElement {
    return this.gameContainer.containerO;
  }
  private get containerModif(): HTMLDivElement {
    return this.gameContainer.containerM;
  }
  private getAspectRatio(): number {
    return this.gameContainer.containerO.clientWidth / this.gameContainer.containerO.clientHeight;
  }

  private startRenderingLoop(): void {

    document.addEventListener( "keydown", this.onKeyDown, false );
    this.raycaster = new THREE.Raycaster();
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

    //const URL: string = "api/identification3D";

    if ( event.clientX < this.containerModif.offsetLeft) {
      this.calculateMouse(event, this.containerOriginal);
    } else {
      this.calculateMouse(event, this.containerModif);
    }
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects: THREE.Intersection[] = this.raycaster.intersectObjects( this.sceneModif.children);
    if (intersects.length > 0) {

      const obj: THREE.Mesh = intersects[0].object as THREE.Mesh;
      obj.material = new THREE.MeshPhongMaterial({map: new THREE.TextureLoader().load(("assets/marble1.jpg")) });

      const objMessage: Obj3DClickMessage = {position: obj.position, name: obj.name};

      this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
    }
  }

  private calculateMouse(event: MouseEvent, container: HTMLDivElement): void {
    const MULTI: number = 2;
    this.mouse.x = (event.offsetX  / container.offsetWidth) * MULTI - 1;
    this.mouse.y = -(event.offsetY / container.offsetHeight) * MULTI + 1;
  }
}
