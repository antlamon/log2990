import { Component, OnInit, Input} from "@angular/core";
import { GameService } from "../services/game.service";
import { IGame } from "../../../../common/models/game";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { IGame3D } from "../../../../common/models/game3D";
import { RenderService } from "../scene3D/scene3-d/render.service";

@Component({
  selector: "app-list-view",
  templateUrl: "./list-view.component.html",
  styleUrls: ["./list-view.component.css"]
})

export class ListViewComponent implements OnInit {

  public simpleGames: IGame[];
  public freeGames: IGame3D[];
  public imageURLs: Map<IGame3D, string>;
  @Input() public isAdminMode: Boolean;

  public constructor(private gameService: GameService,
                     private socket: SocketService,
                     private renderer: RenderService) {
    this.isAdminMode = false;
    this.socket.addEvent(SocketsEvents.UPDATE_SIMPLES_GAMES, this.getSimpleGames.bind(this));
    this.socket.addEvent(SocketsEvents.UPDATE_FREE_GAMES, this.getFreeGames.bind(this));
    this.socket.addEvent(SocketsEvents.SIMPLE_GAME_ADDED, this.addSimpleGame.bind(this));
    this.socket.addEvent(SocketsEvents.FREE_GAME_ADDED, this.addFreeGame.bind(this));
    this.socket.addEvent(SocketsEvents.SIMPLE_GAME_DELETED, this.removeSimpleGame.bind(this));
    this.socket.addEvent(SocketsEvents.FREE_GAME_DELETED, this.removeFreeGame.bind(this));
    this.imageURLs = new Map();
  }

  public ngOnInit(): void {
    this.getSimpleGames();
    this.getFreeGames();
    this.isAdminMode = false;
  }

  private async getImageURL(game: IGame3D): Promise<void> {
    const imageURL: string = await this.renderer.getImageURL(game);
    this.imageURLs.set(game, imageURL);
  }

  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((response: IGame[]) => {this.simpleGames = response; });
  }
  public addSimpleGame(game: IGame): void {
    this.simpleGames.push(game);
  }
  public addFreeGame(game: IGame3D): void {
    this.freeGames.push(game);
  }
  public removeSimpleGame(id: string): void {
    const index: number = this.simpleGames.findIndex((x: IGame) => x.id === id);
    if (index !== -1) {
      this.simpleGames.splice(index, 1);
    }
  }
  public removeFreeGame(id: string): void {
    const index: number = this.freeGames.findIndex((x: IGame3D) => x.id === id);
    if (index !== -1) {
      this.freeGames.splice(index, 1);
    }
  }
  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((response: IGame3D[]) => {
          this.freeGames = response;
          for (const game of response ) {
            this.getImageURL(game);
          }
         });
  }

}
