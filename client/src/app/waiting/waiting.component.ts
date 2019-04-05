import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { INewGameMessage } from "../../../../common/communication/message";

@Component({
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.css"]
})
export class WaitingComponent implements OnInit, OnDestroy {

  public constructor (private router: Router, private socket: SocketService, private route: ActivatedRoute) { }
  public ngOnInit(): void {
        this.socket.addEvent(SocketsEvents.START_MULTIPLAYER_GAME, this.startGame.bind(this));
        this.socket.addEvent(SocketsEvents.NEW_GAME_LIST_LOADED, () => {
          this.socket.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, this.getId());
        });
  }
  public ngOnDestroy(): void {
    this.socket.unsubscribeTo(SocketsEvents.NEW_GAME_LIST_LOADED);
    this.socket.unsubscribeTo(SocketsEvents.START_MULTIPLAYER_GAME);
  }
  public cancel(): void {
    this.socket.emitEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, this.getId);
    this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
  }
  private startGame(gameMessage: INewGameMessage ): void {
    if (this.getId() === gameMessage.gameId) {
      if (!gameMessage.is3D) {
        this.router.navigate(["simple-game/" + gameMessage.gameId], {queryParams: {gameRoomId: gameMessage.gameRoomId}})
        .catch((error: Error) => console.error(error.message));
     } else {
       this.router.navigate(["free-game/" + gameMessage.gameId], {queryParams: {gameRoomId: gameMessage.gameRoomId}})
       .catch((error: Error) => console.error(error.message));
     }
    }
  }

  private getId(): string {
    return String(this.route.snapshot.paramMap.get("id"));
  }

}
