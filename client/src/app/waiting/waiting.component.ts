import { Component, OnInit, OnDestroy, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { INewGameMessage } from "../../../../common/communication/message";
import { IndexService } from "../services/index.service";
import { SIMPLE_GAME_PATH, FREE_GAME_PATH } from "../global/constants";

@Component({
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.css"]
})
export class WaitingComponent implements OnInit, OnDestroy, AfterViewInit {

  public constructor(private router: Router, private socket: SocketService, private route: ActivatedRoute,
                     private index: IndexService) { }
  public ngOnInit(): void {
    this.socket.addEvent(SocketsEvents.FREE_GAME_DELETED, this.handleGameDeleted.bind(this));
    this.socket.addEvent(SocketsEvents.SIMPLE_GAME_DELETED, this.handleGameDeleted.bind(this));
    this.socket.addEvent(SocketsEvents.START_MULTIPLAYER_GAME, this.startGame.bind(this));
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
    this.socket.emitEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, this.getId());
    this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
  }

  private startGame(gameMessage: INewGameMessage): void {
    if (this.getId() === gameMessage.gameId) {
      if (!gameMessage.is3D) {
        this.router.navigate([SIMPLE_GAME_PATH + gameMessage.gameId], { queryParams: { gameRoomId: gameMessage.gameRoomId } })
          .catch((error: Error) => console.error(error.message));
      } else {
        this.router.navigate([FREE_GAME_PATH + gameMessage.gameId], { queryParams: { gameRoomId: gameMessage.gameRoomId } })
          .catch((error: Error) => console.error(error.message));
      }
    }
  }

  private handleGameDeleted(id: string): void {
    if (this.getId() === id) {
      alert("Le jeu a été supprimer. Vous allez être renvoyé à la liste des jeux");
      this.cancel();
    }
  }

  private getId(): string {
    return String(this.route.snapshot.paramMap.get("id"));
  }

}
