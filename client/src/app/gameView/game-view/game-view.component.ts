import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { IGame } from "../../../../../common/models/game";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-game-view",
  templateUrl: "./game-view.component.html",
  styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {

  public simpleGame: IGame;

  public constructor(
    private gameService: GameService,
    private route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.getSimpleGame();
  }

  private getId(): number {

    return Number(this.route.snapshot.paramMap.get("id"));
  }

  public getSimpleGame(): void {
    this.gameService.getSimpleGame(this.getId())
        .then((response: IGame) => this.simpleGame = response[0] )
        .catch(() => "getSimpleGame");
  }

}
