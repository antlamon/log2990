import { Component, OnInit, Input} from "@angular/core";
import { GameService } from "../services/game.service";
import { IGame } from "../../../../common/models/game";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { Router} from "@angular/router";
import { IGame3D } from "../../../../common/models/game3D";

@Component({
  selector: "app-list-view",
  templateUrl: "./list-view.component.html",
  styleUrls: ["./list-view.component.css"]
})

export class ListViewComponent implements OnInit {

  public simpleGames: IGame[];
  public freeGames: IGame3D[];
  @Input() public isAdminMode: Boolean;

  public constructor(private gameService: GameService, private socket: SocketService, private router: Router) {
    this.isAdminMode = false;
    this.socket.addEvent(SocketsEvents.UPDATE_SIMPLES_GAMES, this.getSimpleGames.bind(this));
    this.socket.addEvent(SocketsEvents.UPDATE_FREE_GAMES, this.getFreeGames.bind(this));
  }

  public ngOnInit(): void {
    this.getSimpleGames();
    this.getFreeGames();
    this.isAdminMode = false;
  }

  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((response: IGame[]) => {this.simpleGames = response; });
  }

  public deleteSimpleGames(game: IGame): void {
    // TODO: warning delete box "are you sure? yes/no"
    const index: number = this.simpleGames.findIndex((x: IGame) => x === game);
    if (index !== -1) {
      this.simpleGames.splice(index, 1);
      this.gameService.deleteSimpleGame(game).subscribe();
    }
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((response: IGame3D[]) => {this.freeGames = response; });
  }

  public deleteFreeGames(game: IGame3D): void {
    // TODO: warning delete box "are you sure? yes/no"
    const index: number = this.freeGames.findIndex((x: IGame3D) => x === game);
    if (index !== -1) {
      this.freeGames.splice(index, 1);
      this.gameService.deleteFreeGame(game).subscribe();
    }
  }

  public playSelectedSimpleGame(game: IGame): void {
    this.router.navigate(["simple-game/" + game.id]);

  }

  public playSelectedFreeGame(game: Game3D): void {
    this.router.navigate(["free-game/" + game.id]);
  }

}
