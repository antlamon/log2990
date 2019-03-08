import { Component, Input, AfterViewInit, ViewChild, ElementRef, HostListener } from "@angular/core";
import "src/js/three";
import "node_modules/three/examples/js/controls/OrbitControls";
import * as THREE from "three";
import { MAX_COLOR } from "../../../../../common/models/objet3D";
import { MedievalForestComponent } from "./medieval-forest/medieval-forest.component";

@Component({
  selector: "app-thematic-scene",
  templateUrl: "./thematic-scene.component.html",
  styleUrls: ["./thematic-scene.component.css"]
})
export class ThematicSceneComponent implements AfterViewInit {

  @Input() public isCardMode: boolean;

  @ViewChild("container")
  private containerRef: ElementRef;

  public imageBase64: string;

  private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;

  private controls: THREE.OrbitControls;

  private scene: THREE.Scene;

  private zLight: number = -0.5;
  private xLight: number = 1;

  private cameraZ: number = -10;
  private cameraX: number = 0;
  private cameraY: number = 5;

  private light: THREE.Light;

  private fieldOfView: number = 90;

  private nearClippingPane: number = 0.1;

  private farClippingPane: number = 1000;

  private skyBoxSize: number = 300;

  private skyLight: number = 0x606060;

  private groundLight: number = 0x404040;

  private skyBoxURLs: string[] = [
    "assets/clouds/right.png",
    "assets/clouds/left.png",
    "assets/clouds/top.png",
    "assets/clouds/bottom.png",
    "assets/clouds/back.png",
    "assets/clouds/front.png",
  ];
  private skyBoxLoader: THREE.TextureLoader = new THREE.TextureLoader();

  public sceneSubjects: THREE.Object3D[];

  public constructor() {
    this.isCardMode = false;
  }
  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  public ngAfterViewInit(): void {
    this.initialize();
  }
  private initialize(): void {
    this.createScene();
    this.createSkyBox();
    this.createCamera();
    this.createSceneSubjects();
    // TO DO : remove controls when done testing
    this.controls = new THREE.OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.startRenderingLoop();
  }

  private createScene(): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(MAX_COLOR);

    this.scene.add(new THREE.HemisphereLight(this.skyLight, this.groundLight));

    this.light = new THREE.DirectionalLight(MAX_COLOR);
    this.light.position.set(this.xLight, 0, this.zLight);
    this.scene.add(this.light);
  }

  private createSkyBox(): void {
    const faceNb: number = 6;

    const materialArray: THREE.MeshBasicMaterial[] = [];
    for (let i: number = 0; i < faceNb; i++) {
      materialArray[i] = new THREE.MeshBasicMaterial({
        map: this.skyBoxLoader.load(this.skyBoxURLs[i]),
        side: THREE.BackSide
      });
    }
    const skyGeometry: THREE.BoxGeometry = new THREE.BoxGeometry(this.skyBoxSize, this.skyBoxSize, this.skyBoxSize);
    const skyMaterial: THREE.MeshFaceMaterial = new THREE.MeshFaceMaterial(materialArray);
    const skyBox: THREE.Mesh = new THREE.Mesh(skyGeometry, skyMaterial);
    this.scene.add(skyBox);
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
    this.camera.position.x = this.cameraX;
    this.camera.position.y = this.cameraY;
    this.camera.position.z = this.cameraZ;
    this.scene.add(this.camera);
  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
  }

  private createSceneSubjects(): void {
    this.sceneSubjects = [
      // call the different subjects' constructor and let them add themselves to the scene
      new MedievalForestComponent(this.scene),
    ];

  }

  private startRenderingLoop(): void {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.BasicShadowMap;
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);

    this.container.appendChild(this.renderer.domElement);
    this.render();
  }

  private render(): void {
    requestAnimationFrame(() => this.render());
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

}
