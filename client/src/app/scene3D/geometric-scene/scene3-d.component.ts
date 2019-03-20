import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input } from "@angular/core";
import { IGame3D } from "../../../../../common/models/game3D";
import * as THREE from "three";
import { ISceneContainer } from "../ISceneContainer";
import { SceneBuilderService } from "src/app/services/scene-builder.service";
import { IObjet3D, IShape3D, MAX_COLOR } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";

@Component({
  selector: "app-scene3-d-component",
  templateUrl: "./scene3-d.component.html",
  styleUrls: ["./scene3-d.component.css"],
})

export class Scene3DComponent implements AfterViewInit, ISceneContainer {

  @Input() public game: IGame3D;
  @Input() public isCardMode: boolean;
  public imageBase64: string;
  private readonly RENDERERING_DELAY: number = 5;

  private skyLight: number = 0x606060;
  private groundLight: number = 0x404040;
  private light: THREE.Light;

  public containerO: HTMLDivElement;
  public containerM: HTMLDivElement;
  @ViewChild("containerO")
  private containerOriginalRef: ElementRef;
  @ViewChild("containerM")
  private containerModifiedRef: ElementRef;

  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.sceneBuilder.onResize();
  }
  public constructor(private sceneBuilder: SceneBuilderService, private shapeCreator: ShapeCreatorService) {
    this.isCardMode = false;
  }
  public ngAfterViewInit(): void {
    this.containerO = this.containerOriginalRef.nativeElement;
    this.containerM = this.containerModifiedRef.nativeElement;
    if ( this.game !== undefined && !this.game.isThemed) {
      this.sceneBuilder.initialize(this);
      setTimeout(() => {
        this.imageBase64 = this.sceneBuilder.rendererO.domElement.toDataURL();
        // this.imageBase64 = ((this.containerO).children[0] as HTMLCanvasElement).toDataURL();
      },         this.RENDERERING_DELAY); // make sure scene is rendered before
    }
    this.containerO.style.display = this.isCardMode ? "none" : "block";
    this.containerM.style.display = this.isCardMode ? "none" : "block";
  }
  public addLightToScene(scene: THREE.Scene): void {
    scene.add( new THREE.HemisphereLight( this.skyLight, this.groundLight ) );
    this.light = new THREE.DirectionalLight( MAX_COLOR );
    this.light.position.set( 1, 0, 0 );
    scene.add(this.light);
  }
  public addObjectsToScene(scene: THREE.Scene, obj: IObjet3D[]): void {
      for (const object of obj) {
        scene.add(this.shapeCreator.createShape(object as IShape3D));
      }
  }

}
