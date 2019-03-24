import { Component, OnDestroy } from "@angular/core";
import { SocketService } from "src/app/services/socket.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IGameMessage } from "../../../../../common/models/simpleGameMessage";
import { GameRoomUpdate } from "../../../../../common/communication/message";

@Component({
  selector: "app-game-messages",
  templateUrl: "./game-messages.component.html",
  styleUrls: ["./game-messages.component.css"]
})
export class GameMessagesComponent implements OnDestroy{

  private readonly PADDED_ZERO: number = -2;

  public gameMessages: IGameMessage[] = [];

  public constructor(private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.NEW_GAME_MESSAGE, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.USER_CONNECTION, this.handleNewConnection.bind(this));
    this.socket.addEvent(SocketsEvents.USER_DECONNECTION, this.handleDeconnection.bind(this));
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
        data: "Différence trouvée !",
      };
      this.gameMessages.push(msg);
    }
  }

  public handleNewConnection(username: string): void {
    const msg: IGameMessage = {
      eventType: "userConnected",
      username: username,
      time: this.getTime(),
      data: " s'est connecté(e)",
    };
    this.gameMessages.push(msg);
  }

  public handleDeconnection(username: string): void {
    const msg: IGameMessage = {
      eventType: "userDisconnected",
      username: username,
      time: this.getTime(),
      data: " s'est déconnecté(e)",
    };
    this.gameMessages.push(msg);
  }

  public handleNewBestTime(username: string, position: string, bestTime: string) {
    const newBestMsg: string = "obtient la" + position + "place dans les meilleurs temps du jeu NOM_JEU en NB_JOUEURS";

    const msg: IGameMessage = {
      eventType: "newBestTime",
      username: username,
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
