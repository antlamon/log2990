import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, Input } from "@angular/core";
import { RenderService } from "./render.service";
import { IGame3D } from "../../../../../common/models/game3D";

@Component({
  selector: "app-scene3-d-component",
  templateUrl: "./scene3-d.component.html",
  styleUrls: ["./scene3-d.component.css"],
})

export class Scene3DComponent implements AfterViewInit {

  @Input() public game: IGame3D;
  @Input() public isCardMode: boolean;
  public imageBase64: String = "";
  private readonly RENDERERING_DELAY: number = 5;

  public constructor(private renderService: RenderService) {
    this.isCardMode = false;
  }

  @ViewChild("containerO")
  private containerRefO: ElementRef;

  @ViewChild("containerM")
  private containerRefM: ElementRef;

  @ViewChild("image")
  private imageRef: ElementRef;

  private get containerO(): HTMLDivElement {
    return this.containerRefO.nativeElement;
  }
  private get containerM(): HTMLDivElement {
    return this.containerRefM.nativeElement;
  }
  private get image(): HTMLImageElement {
    return this.imageRef.nativeElement;
  }
  @HostListener("window:resize", ["$event"])
  public onResize(): void {
    this.renderService.onResize();
  }

  public setGame(game: IGame3D ): void {
    this.game = game;
    this.render(); // we wanna do the rendering if the game has just been set, or been changed
  }

  public ngAfterViewInit(): void {
    if (this.game) {
      this.render();
    }
    this.containerO.style.display = this.isCardMode ? "none" : "block";
    this.containerM.style.display = this.isCardMode ? "none" : "block";
  }

  private render(): void {
    this.renderService.initialize(this.containerO, this.containerM, this.game);
    if (this.isCardMode) {
      setTimeout(() => {
        this.image.src = ((this.containerO).children[0] as HTMLCanvasElement).toDataURL();
      },         this.RENDERERING_DELAY); // make sure scene is rendered before
    }
  }

}
