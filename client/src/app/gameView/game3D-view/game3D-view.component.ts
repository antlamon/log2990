import { Component, OnInit, ViewChild } from "@angular/core";
import { GameService } from "../../services/game.service";
import { ActivatedRoute } from "@angular/router";
import { IGame3D } from "../../../../../common/models/game3D";
import { Scene3DComponent } from "src/app/scene3D/geometric-scene/scene3-d.component";
// import { RenderService } from "src/app/scene3D/geometric-scene/render.service";

@Component({
    selector: "app-game3d-view",
    templateUrl: "./game3D-view.component.html",
    styleUrls: ["./game3D-view.component.css"]
})
export class Game3DViewComponent implements OnInit {

    // @ViewChild("originalContainer")
    // private originalContainerRef: ElementRef;

    // @ViewChild("modifiedContainer")
    // private modifiedContainerRef: ElementRef;
    @ViewChild("scene")
    private scene: Scene3DComponent;

    public game3D: IGame3D;

    public constructor(
        private gameService: GameService,
        private route: ActivatedRoute,
        // private render: RenderService,
    ) {}

    public ngOnInit(): void {
        this.get3DGame();
    }

    private getId(): string {

        return String(this.route.snapshot.paramMap.get("id"));
    }

    // private get originalContainer(): HTMLDivElement {
    //     return this.originalContainerRef.nativeElement;
    // }

    // private get modifiedContainer(): HTMLDivElement {
    //     return this.modifiedContainerRef.nativeElement;
    // }

    public get3DGame(): void {
        this.gameService.get3DGame(this.getId())
            .then((response: IGame3D) => {
                this.game3D = response;
                this.scene.setGame(this.game3D);
            })
            .catch(() => "get3DGame");
    }

}
