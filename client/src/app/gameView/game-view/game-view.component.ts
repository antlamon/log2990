import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { IFullGame } from "../../../../../common/models/game";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {

  public simpleGame: IFullGame;

  public constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.getSimpleGame();
  }

  private getId(): string {

    return String(this.route.snapshot.paramMap.get("id"));
  }

  public getSimpleGame(): void {
    this.gameService.getSimpleGame(this.getId())
        .then((response: IFullGame) => this.simpleGame = response[0] )
        .catch(() => "getSimpleGame");
  }

}
