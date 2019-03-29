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

  public constructor(private gameManager: GameManagerService){ }
  @Input() public isAdminMode: boolean;

  public get simpleGames(): IGame[] {
    return this.gameManager.simpleGames;
  }
  public get freeGames(): IGame3D[] {
    return this.gameManager.freeGames;
  }
  public getImageUrl(game: IGame3D): string {
    return this.gameManager.getImageUrl(game);
  }
}
