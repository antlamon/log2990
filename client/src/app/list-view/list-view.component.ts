import { Component, Input, AfterViewInit} from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { GameManagerService } from "../services/game-manager.service";
import { Router } from "@angular/router";
import { IndexService } from "../services/index.service";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { INITIAL_PATH } from "../global/constants";
@Component({
  selector: "app-list-view",
  templateUrl: "./list-view.component.html",
  styleUrls: ["./list-view.component.css"]
})

export class ListViewComponent implements AfterViewInit {

  @Input() public isAdminMode: boolean;
  public simpleGames: IGame[];
  public freeGames: IGame3D[];
  public constructor(private gameManager: GameManagerService, private router: Router, private index: IndexService,
                     private socket: SocketService) {
    this.gameManager.freeGames.subscribe((games: IGame3D[]) => {
      this.socket.emitEvent(SocketsEvents.NEW_GAME_LIST_LOADED);
      this.freeGames = games;
    });
    this.gameManager.simpleGames.subscribe((games: IGame[]) => {
      this.socket.emitEvent(SocketsEvents.NEW_GAME_LIST_LOADED);
      this.simpleGames = games;
    });
   }
  public getImageUrl(game: IGame3D): string {
    return this.gameManager.getImageUrl(game);
  }
  public ngAfterViewInit(): void {
    if (!this.isAdminMode) {
      if (!this.index.username) {
        this.router.navigate([INITIAL_PATH]);
      }
    }
  }
}
