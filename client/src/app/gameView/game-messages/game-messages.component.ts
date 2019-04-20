import { Component, OnDestroy } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IGameMessage } from "../../../../../common/models/gameMessages";
import { GameRoomUpdate, NewScoreUpdate, NewGameStarted } from "../../../../../common/communication/message";

@Component({
  selector: "app-game-messages",
  templateUrl: "./game-messages.component.html",
  styleUrls: ["./game-messages.component.css"]
})
export class GameMessagesComponent implements OnDestroy {

  private readonly PADDED_ZERO: number = -2;

  private gameMessages: IGameMessage[];
  private isMultiplayer: boolean;
  private readonly positions: string[] = ["première", "deuxième", "troisième"];

  public constructor(private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleNewGameRoom.bind(this));
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.USER_CONNECTION, this.handleConnection.bind(this));
    this.socket.addEvent(SocketsEvents.SCORES_UPDATED, this.handleNewBestTime.bind(this));
    this.isMultiplayer = false;
    this.gameMessages = [];
  }

  public ngOnDestroy(): void {
    this.gameMessages = [];
    this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE);
  }

  private handleNewGameRoom(response: NewGameStarted): void {
    this.isMultiplayer = response.players.length > 1;
  }

  public handleNewIdentification(update: GameRoomUpdate): void {
    let text: string;
    if (update.differencesFound === -1) {
      text = "Erreur";
      if (this.isMultiplayer) {
        text += ` par ${update.username}`;
      }
      const msg: IGameMessage = {
        time: this.getTime(),
        text,
      };
      this.gameMessages.push(msg);
    } else {
      text = "Différence trouvée";
      if (this.isMultiplayer) {
        text += ` par ${update.username}`;
      }
      const msg: IGameMessage = {
        time: this.getTime(),
        text,
      };
      this.gameMessages.push(msg);
    }
  }

  public handleConnection(username: string, eventType: string): void {
    if (eventType === "userConnected") {
      const msg: IGameMessage = {
        time: this.getTime(),
        text: `${username} s'est connecté(e)`,
      };
      this.gameMessages.push(msg);

    } else {
    const msg: IGameMessage = {
      time: this.getTime(),
      text: `${username} s'est déconnecté(e)`,
    };
    this.gameMessages.push(msg);
    }
  }

  public handleNewBestTime(newScoreUpdate: NewScoreUpdate): void {
    let newBestMsg: string;
    if (newScoreUpdate.username) {
      newBestMsg = `${newScoreUpdate.username} obtient la ${this.positions[newScoreUpdate.scoreUpdate.insertPos - 1]}
      place dans les meilleurs temps du jeu ${newScoreUpdate.gameName} en ${newScoreUpdate.gameMode}`;
      const msg: IGameMessage = {
        time: this.getTime(),
        text: newBestMsg,
      };
      this.gameMessages.push(msg);
    }
  }

  private getTime(): string {
    const today: Date = new Date();

    return ("0" + today.getHours()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getMinutes()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getSeconds()).slice(this.PADDED_ZERO);
  }

}
