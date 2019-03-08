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

  private cameraZ: number = 30;
  private cameraY: number = 20;

  private light: THREE.Light;

  private fieldOfView: number = 90;

  private nearClippingPane: number = 0.1;

  private farClippingPane: number = 1000;

  private skyLight: number = 0x606060;

  private groundLight: number = 0x404040;

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
    this.createCamera();
    this.createSceneSubjects();
    this.controls = new THREE.OrbitControls(this.camera, this.container);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = true;

    this.startRenderingLoop();
  }

  private createScene(): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xbfd1e5);
    this.scene.add(new THREE.HemisphereLight(this.skyLight, this.groundLight));
    this.light = new THREE.DirectionalLight(MAX_COLOR);
    this.light.position.set(0, 1, 1);
    this.scene.add(this.light);
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
    this.camera.position.y = this.cameraY;
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
