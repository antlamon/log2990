import { Component, OnInit } from '@angular/core';
import { SocketService } from 'src/app/services/socket.service';
import { SocketsEvents } from '../../../../../common/communication/socketsEvents';
import { MessageService } from "../../services/message.service";
import { IGameMessage } from "../../../../../common/models/simpleGameMessage";

@Component({
  selector: 'app-game-messages',
  templateUrl: './game-messages.component.html',
  styleUrls: ['./game-messages.component.css']
})
export class GameMessagesComponent implements OnInit {

  public gameMessages: IGameMessage[];

  public constructor(private socket: SocketService, private gameMessageService: MessageService) {
    this.socket.addEvent(SocketsEvents.NEW_GAME_MESSAGE, this.getMessages.bind(this));
  }

  public ngOnInit(): void {
    this.getMessages();
  }

  public getMessages(): void {
    this.gameMessageService.getMessages()
      .subscribe((response: IGameMessage[]) => {this.gameMessages = response; });
    (console as Console).log(this.gameMessages);
  }

}
