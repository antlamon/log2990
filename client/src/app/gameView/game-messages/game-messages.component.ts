import { Component, OnDestroy } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IGameMessage } from "../../../../../common/models/gameMessages";
import { GameRoomUpdate, NewScoreUpdate } from "../../../../../common/communication/message";

@Component({
  selector: "app-game-messages",
  templateUrl: "./game-messages.component.html",
  styleUrls: ["./game-messages.component.css"]
})
export class GameMessagesComponent implements OnDestroy {

  private readonly PADDED_ZERO: number = -2;

  public gameMessages: IGameMessage[] = [];

  public constructor(private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.USER_CONNECTION, this.handleConnection.bind(this));
    this.socket.addEvent(SocketsEvents.NEW_BEST_TIME, this.handleNewBestTime.bind(this));
  }

  public ngOnDestroy(): void {
    this.gameMessages = [];
  }

  public handleNewIdentification(update: GameRoomUpdate): void {
    if (update.differencesFound === -1) {
      const msg: IGameMessage = {
        eventType: "identificationError",
        username: "",
        time: this.getTime(),
        data: "Erreur",
      };
      this.gameMessages.push(msg);
    } else {
      const msg: IGameMessage = {
        eventType: "differenceFound",
        username: "",
        time: this.getTime(),
        data: "Différence trouvée",
      };
      this.gameMessages.push(msg);
    }
  }

  public handleConnection(username: string, eventType: string): void {
    if (eventType === "userConnected") {
      const msg: IGameMessage = {
        eventType: eventType,
        username: username,
        time: this.getTime(),
        data: " s'est connecté(e)",
      };
      this.gameMessages.push(msg);

    } else {
    const msg: IGameMessage = {
      eventType: eventType,
      username: username,
      time: this.getTime(),
      data: " s'est déconnecté(e)",
    };
    this.gameMessages.push(msg);
    }
  }

  public handleNewBestTime(newScoreUpdate: NewScoreUpdate): void {
    const newBestMsg: string = `obtient la ${newScoreUpdate.scoreUpdate.insertPos} place dans les meilleurs
     temps du jeu ${newScoreUpdate.gameName} en ${newScoreUpdate.gameMode}`;

    const msg: IGameMessage = {
      eventType: "newBestTime",
      username: newScoreUpdate.username,
      time: this.getTime(),
      data: newBestMsg,
    };
    this.gameMessages.push(msg);
  }

  private getTime(): string {
    const today: Date = new Date();

    return ("0" + today.getHours()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getMinutes()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getSeconds()).slice(this.PADDED_ZERO);
  }

}
