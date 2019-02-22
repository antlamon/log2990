import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { ActivatedRoute } from "@angular/router";
import { Game3D } from "../../../../../common/models/game3D";

@Component({
  selector: 'app-game3D-view',
  templateUrl: './game3D-view.component.html',
  styleUrls: ['./game3D-view.component.css']
})
export class Game3DViewComponent implements OnInit {

  public game3D: Game3D;

  public constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.get3DGame();
  }

  private getId(): string {

    return String(this.route.snapshot.paramMap.get("id"));
  }

  public get3DGame(): void {
    this.gameService.get3DGame(this.getId())
        .then((response: Game3D) => this.game3D = response)
        .catch(() => "get3DGame");
  }

}
