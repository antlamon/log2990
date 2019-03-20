import { Component, Input, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import "src/js/three";
import "node_modules/three/examples/js/controls/OrbitControls";
import * as THREE from "three";
import { MAX_COLOR, IObjet3D } from "../../../../../common/models/objet3D";
import { MedievalForestService } from "./medieval-forest/medieval-forest.service";
import { IGame3D, MOCK_THEMED_GAME } from "../../../../../common/models/game3D";
import { ISceneContainer } from "../ISceneContainer";
import { SceneBuilderService } from "src/app/services/scene-builder.service";

@Component({
  selector: "app-thematic-scene",
  templateUrl: "./thematic-scene.component.html",
  styleUrls: ["./thematic-scene.component.css"]
})
export class ThematicSceneComponent implements AfterViewInit, ISceneContainer {

  @Input() public isCardMode: boolean;
  @Input() public game: IGame3D = MOCK_THEMED_GAME;
  public imageBase64: string;
  public containerO: HTMLDivElement;
  public containerM: HTMLDivElement;

  @ViewChild("containerO")
  private containerOriginalRef: ElementRef;
  @ViewChild("containerM")
  private containerModifRef: ElementRef;

  private zLight: number = -0.5;
  private xLight: number = 1;
  private light: THREE.Light;
  private skyLight: number = 0xFFFFFF;
  private groundLight: number = 0x404040;

  public constructor(private forestService: MedievalForestService, private builderService: SceneBuilderService) {
    this.isCardMode = false;
  }
  public ngAfterViewInit(): void {
    this.containerO = this.containerOriginalRef.nativeElement;
    this.containerM = this.containerModifRef.nativeElement;

    if ( this.game !== undefined && this.game.isThemed) {
      this.builderService.initialize(this);
      Promise.all(this.forestService.getPromises()).then(() => {
        this.imageBase64 = ((this.containerO).children[0] as HTMLCanvasElement).toDataURL();
      });
    }
    this.containerO.style.display = this.isCardMode ? "none" : "block";
    this.containerM.style.display = this.isCardMode ? "none" : "block";
  }

  public addLightToScene(scene: THREE.Scene): void {
    scene.add(new THREE.HemisphereLight(this.skyLight, this.groundLight));
    this.light = new THREE.DirectionalLight(MAX_COLOR);
    this.light.position.set(this.xLight, 0, this.zLight);
    scene.add(this.light);
  }
  public addObjectsToScene(scene: THREE.Scene, obj: IObjet3D[]): void {
    this.forestService.createForest(scene, obj);
  }
}
