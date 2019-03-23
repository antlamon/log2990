import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SocketsEvents } from '../../../../../common/communication/socketsEvents';
import { IGameMessage, IMessageForm } from "../../../../../common/models/simpleGameMessage";
import { GameRoomUpdate } from '../../../../../common/communication/message';
import { GameMessageService } from "../../../../../server/app/services/game-message.service"

@Component({
  selector: 'app-game-messages',
  templateUrl: './game-messages.component.html',
  styleUrls: ['./game-messages.component.css']
})
export class GameMessagesComponent implements OnInit {

  public gameMessages: IGameMessage[];

  public constructor(private socket: SocketService, private gameMessageService: GameMessageService) {
    this.socket.addEvent(SocketsEvents.NEW_GAME_MESSAGE, this.handleNewIdentification.bind(this));
    this.socket.addEvent(SocketsEvents.USER_CONNECTION, this.handleNewConnection.bind(this));
    this.socket.addEvent(SocketsEvents.USER_DECONNECTION, this.handleDeconnection.bind(this));
  }

  public ngOnInit(): void {
    // this.getMessages();
  }

  public handleNewIdentification(update: GameRoomUpdate): void {
    if (update.differencesFound === -1) {
      const msg: IMessageForm = {
        eventType: "differenceFound",
        username: update.username,
      };
      this.gameMessageService.sendMessage(msg).catch();
      console.log("Erreur d'identification");
    } else {
      const msg: IMessageForm = {
        eventType: "identificationError",
        username: update.username,
      };
      this.gameMessageService.sendMessage(msg);
      console.log("Erreur trouvée !");
    }
  }

  public handleNewConnection(): void {
    console.log("Un utilisateur s'est connecté");
  }

  public handleDeconnection(): void {
    console.log("Un utilisateur s'est déconnecté");
  }
}
