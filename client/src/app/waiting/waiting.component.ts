import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { IGame3D } from "../../../../common/models/game3D";
import { IGame } from "../../../../common/models/game";
import { IndexService } from "../services/index.service";

@Component({
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.css"]
})
export class WaitingComponent implements OnInit, OnDestroy, AfterViewInit {

  public constructor (private router: Router, private socket: SocketService, private route: ActivatedRoute,
                      private index: IndexService) { }
  public ngOnInit(): void {
        this.socket.addEvent(SocketsEvents.START_MULTIPLAYER_GAME, (game: IGame | IGame3D) => {
          if (game.id === this.getId()) {
            this.startGame(game);
          }
        });
        this.socket.addEvent(SocketsEvents.NEW_GAME_LIST_LOADED, () => {
          this.socket.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, this.getId());
        });
  }
  public ngAfterViewInit(): void {
    if (!this.index.username) {
      this.router.navigate([""]);
    }
  }
  public ngOnDestroy(): void {
    this.socket.unsubscribeTo(SocketsEvents.NEW_GAME_LIST_LOADED);
    this.socket.unsubscribeTo(SocketsEvents.START_MULTIPLAYER_GAME);
  }
  public cancel(): void {
    this.socket.emitEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, this.getId);
    this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
  }
  private startGame(game: IGame | IGame3D ): void {
    if (this.isSimpleGame(game)) {
      this.router.navigate(["simple-game/" + game.id]).catch((error: Error) => console.error(error.message));
   } else {
     this.router.navigate(["free-game/" + game.id]).catch((error: Error) => console.error(error.message));
   }
  }
  private isSimpleGame(game: IGame | IGame3D): boolean {
    return (game) && "originalImage" in game;
  }
  private getId(): string {
    return String(this.route.snapshot.paramMap.get("id"));
  }

}
