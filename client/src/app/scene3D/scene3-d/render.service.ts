import { Injectable } from "@angular/core";
import * as THREE from "three";
import { IScene3D } from "../../../../../common/models/game3D";
import { MAX_COLOR } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import GLTFLoader from "three-gltf-loader";

@Injectable()
export class RenderService {

  private container: HTMLDivElement;

  private camera: THREE.PerspectiveCamera;

  private renderer: THREE.WebGLRenderer;

  private scene: THREE.Scene;

  private cameraZ: number = 500;

  private light: THREE.Light;

  private fieldOfView: number = 75;

  private nearClippingPane: number = 1;

  private farClippingPane: number = 3000;

  private skyLight: number = 0x606060;
  private groundLight: number = 0x404040;

  private modelsLoader: GLTFLoader = new GLTFLoader();

  public constructor(private shapeService: ShapeCreatorService) { }

  public initialize(container: HTMLDivElement, scen: IScene3D): void {

    this.container = container;

    this.createScene(scen);

    for (const obj of scen.objects) {
      this.scene.add(this.shapeService.createShape(obj));
    }

    this.startRenderingLoop();
  }

  public random(min: number, max: number): number {

    return Math.random() * (max - min + 1) + min;

  }

  public onResize(): void {
    this.camera.aspect = this.getAspectRatio();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.container.clientWidth, this.container.clientHeight);
  }

  private createScene(scene: IScene3D): void {
    /* Scene */
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(scene.backColor);
    this.createCamera();
    this.scene.add(new THREE.HemisphereLight(this.skyLight, this.groundLight));
    this.light = new THREE.DirectionalLight(MAX_COLOR);
    this.light.position.set(0, 0, 1);
    this.scene.add(this.light);
    // Load a glTF resource
    this.modelsLoader.load(
      // resource URL
      "../../assets/scene.gltf",
      // called when the resource is loaded
      (gltf) => {

        gltf.scene.children[0].scale.set(0.15, 0.15, 0.15);
        gltf.scene.children[0].rotateX(50);
        gltf.scene.children[0].rotateY(50);
        gltf.scene.children[0].rotateZ(200);
        gltf.scene.children[0].position.set(100,10,10);


        this.scene.add(gltf.scene);

        gltf.animations; // Array<THREE.AnimationClip>
        gltf.scene; // THREE.Scene
        gltf.scenes; // Array<THREE.Scene>
        gltf.cameras; // Array<THREE.Camera>
        gltf.asset; // Object

      },
      // called while loading is progressing
      (xhr) => {

        console.log((xhr.loaded / xhr.total * 100) + "% loaded");

      },
      // called when loading has errors
      function (error) {

        console.log('An error happened');

      }
    );

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
    this.scene.add(this.camera);

  }

  private getAspectRatio(): number {
    return this.container.clientWidth / this.container.clientHeight;
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
    this.renderer.render(this.scene, this.camera);
  }
}
