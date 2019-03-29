import { Component, Input} from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { GameManagerService } from "../services/game-manager.service";
@Component({
  selector: "app-list-view",
  templateUrl: "./list-view.component.html",
  styleUrls: ["./list-view.component.css"]
})

export class ListViewComponent {

  @Input() public isAdminMode: boolean;
  public simpleGames: IGame[];
  public freeGames: IGame3D[];
  public constructor(private gameManager: GameManagerService) {
    this.gameManager.freeGames.subscribe((games: IGame3D[]) => {
      this.freeGames = games;
    });
    this.gameManager.simpleGames.subscribe((games: IGame[]) => {
      this.simpleGames = games;
    });
   }
  public getImageUrl(game: IGame3D): string {
    return this.gameManager.getImageUrl(game);
  }
}
