import { Component, Input, OnInit } from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { GameService } from "../services/game.service";
import { Router } from "@angular/router";
import {FREE_GAME_TYPE, SIMPLE_GAME_TYPE} from "../../../../common/communication/message";
import { SocketService } from "../services/socket.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import {SIMPLE_GAME_PATH, FREE_GAME_PATH, WAITING_PATH} from "../../app/global/constants";
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
  @Input()
  private game: IGame | IGame3D;
  public isJoinable: boolean;
  public constructor(private gameService: GameService, private router: Router, private socket: SocketService) {
    this.isAdminMode = false;
    this.game = {solo: [], multi: [], name: "", id: "", originalImage: ""};
    this.isJoinable = false;
   }
  public ngOnInit(): void {
    this.socket.addEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, this.handleNewMulitplayerGamer.bind(this));
    this.socket.addEvent(SocketsEvents.START_MULTIPLAYER_GAME, this.handleStartMulitplayerGamer.bind(this));
    this.socket.addEvent(SocketsEvents.CANCEL_MULTIPLAYER_GAME, this.handleCancelMulitplayerGamer.bind(this));
   }

  public playSelectedGame(): void {
    if (this.isSimpleGame) {
       this.router.navigate([SIMPLE_GAME_PATH + this.game.id]).catch((error: Error) => console.error(error.message));
    } else {
      this.router.navigate([FREE_GAME_PATH + this.game.id]).catch((error: Error) => console.error(error.message));
    }
  }
  public createMultiGame(): void {
    this.socket.emitEvent(SocketsEvents.NEW_MULTIPLAYER_GAME, this.game.id);
    this.router.navigate([WAITING_PATH + this.game.id]).catch((error: Error) => console.error(error.message));
  }
  public joinMultiGame(): void {
    this.socket.emitEvent(SocketsEvents.START_MULTIPLAYER_GAME, this.game);
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
  private handleNewMulitplayerGamer(iD: string): void {
    if (this.game.id === iD) {
      this.isJoinable = true;
    }
  }
  private handleStartMulitplayerGamer(gam: IGame3D|IGame|string): void {
    if (this.game.id === (gam as IGame).id) {
      this.isJoinable = false;
    }
  }
  private handleCancelMulitplayerGamer(iD: string): void {
    if (this.game.id === iD) {
      this.isJoinable = false;
    }
  }

}
