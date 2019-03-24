import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SocketsEvents } from '../../../../../common/communication/socketsEvents';
import { IGameMessage } from "../../../../../common/models/simpleGameMessage";
import { GameRoomUpdate } from '../../../../../common/communication/message';

@Component({
  selector: 'app-game-messages',
  templateUrl: './game-messages.component.html',
  styleUrls: ['./game-messages.component.css']
})
export class GameMessagesComponent implements OnInit {

  private readonly PADDED_ZERO: number = -2;

  public gameMessages: IGameMessage[] = [];

  public constructor(private socket: SocketService) {
    this.socket.addEvent(SocketsEvents.NEW_GAME_MESSAGE, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.USER_CONNECTION, this.handleNewConnection.bind(this));
    this.socket.addEvent(SocketsEvents.USER_DECONNECTION, this.handleDeconnection.bind(this));
    this.socket.addEvent(SocketsEvents.USER_LEAVE_GAME, this.handleLeaveGame.bind(this));
  }

  private handleNewIdentification(update: GameRoomUpdate): void {
    if (update.differencesFound === -1) {
      const msg: IGameMessage = {
        eventType: "identificationError",
        username: "",
        time: this.getTime(),
        data: "Erreur",
      };
      this.gameMessages.push(msg);
      // console.log("[" + msg.time + "] " + msg.username + " a fait une erreur d'identification");
    } else {
      const msg: IGameMessage = {
        eventType: "differenceFound",
        username: "",
        time: this.getTime(),
        data: "Différence trouvée !",
      };
      this.gameMessages.push(msg);
      // console.log("[" + msg.time + "] " + msg.username + " a trouvé une erreur !");
    }
  }

  private handleNewConnection(username: string): void {
    const msg: IGameMessage = {
      eventType: "userConnected",
      username: username,
      time: this.getTime(),
      data: " s'est connecté(e)",
    };
    console.log("[" + msg.time + "] " + msg.username + " s'est connecté(e)");
  }

  private handleDeconnection(username: string): void {
    const msg: IGameMessage = {
      eventType: "userDisconnected",
      username: username,
      time: this.getTime(),
      data: " s'est déconnecté(e)",
    };
    this.gameMessages.push(msg);
    // console.log("[" + msg.time + "] " + msg.username + " s'est déconnecté(e)");
  }

  private handleLeaveGame(): void {
    this.gameMessages = [];
  }

  private getTime(): string{
    const today: Date = new Date();

    return ("0" + today.getHours()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getMinutes()).slice(this.PADDED_ZERO) + ":" +
           ("0" + today.getSeconds()).slice(this.PADDED_ZERO);
  }
}
