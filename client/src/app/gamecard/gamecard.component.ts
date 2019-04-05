import { Component, Input, OnInit } from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { GameService } from "../services/game.service";
import { Router } from "@angular/router";
import {FREE_GAME_TYPE, SIMPLE_GAME_TYPE, NewMultiplayerGame, INewGameMessage} from "../../../../common/communication/message";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { IndexService } from "../services/index.service";

@Component({
  selector: "app-gamecard",
  templateUrl: "./gamecard.component.html",
  styleUrls: ["./gamecard.component.css"]
})
export class GamecardComponent implements OnInit {
  @Input()
  public isAdminMode: boolean;
  @Input()
  public imgURL: string;
  public isJoinable: boolean;
  @Input()
  private game: IGame | IGame3D;
  private joinableGameRoomId: string;

  public constructor(private gameService: GameService, private router: Router,
                     private socket: SocketService, private indexService: IndexService) {
    this.isAdminMode = false;
    this.game = {solo: [], multi: [], name: "", id: "", originalImage: ""};
    this.isJoinable = false;
   }
  public ngOnInit(): void {
    this.socket.addEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, this.handleNewMulitplayerGamer.bind(this));
    this.socket.addEvent(SocketsEvents.START_MULTIPLAYER_GAME, this.resetJoinableGame.bind(this));
    this.socket.addEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, this.resetJoinableGame.bind(this));
   }

  public playSelectedGame(): void {
    if (this.isSimpleGame) {
       this.router.navigate(["simple-game/" + this.game.id], {queryParams: {gameRoomId: this.joinableGameRoomId}})
       .catch((error: Error) => console.error(error.message));
    } else {
      this.router.navigate(["free-game/" + this.game.id], {queryParams: {gameRoomId: this.joinableGameRoomId}})
      .catch((error: Error) => console.error(error.message));
    }
  }
  public createMultiGame(): void {
    this.socket.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, {
      gameId: this.game.id,
      gameName: this.game.name,
      is3D: !this.isSimpleGame,
      username: this.indexService.username,
    });
    this.router.navigate(["waiting/" + this.game.id]).catch((error: Error) => console.error(error.message));
  }
  public joinMultiGame(): void {
    this.socket.emitEvent(SocketsEvents.START_MULTIPLAYER_GAME, {
      gameId: this.game.id,
      gameRoomId: this.joinableGameRoomId,
      is3D: !this.isSimpleGame,
      username: this.indexService.username,
    });
    this.playSelectedGame();
  }
  public deleteGame(): void {
    if (this.game) {
      if (confirm("Voulez vous supprimer le jeu " + this.game.name + " ?")) {
        if (this.isSimpleGame) {
          this.gameService.deleteSimpleGame(this.game as IGame).subscribe();
        } else {
          this.gameService.deleteFreeGame(this.game as IGame3D).subscribe();
        }
      }
    }
  }
  public reinitGame(): void {
    if (this.game) {
      if (confirm("Voulez vous reinitialiser le score du jeu " + this.game.name + " ?")) {
          this.gameService.resetScore(this.game.id, this.isSimpleGame ? SIMPLE_GAME_TYPE : FREE_GAME_TYPE).subscribe();
      }
    }
  }
  public get isSimpleGame(): boolean {
    return (this.game) && "originalImage" in this.game;
  }

  private handleNewMulitplayerGamer(newMultiplayerGame: NewMultiplayerGame): void {
    if (this.game.id === newMultiplayerGame.gameId) {
      this.isJoinable = true;
      this.joinableGameRoomId = newMultiplayerGame.gameRoomId;
    }
  }

  private resetJoinableGame(gameMessage: INewGameMessage): void {
    if (this.game.id === gameMessage.gameId) {
      this.isJoinable = false;
      this.joinableGameRoomId = null;
    }
  }
}
