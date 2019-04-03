import { Injectable } from "@angular/core";
import * as ClientSocketIO from "socket.io-client";
import {BASE_SERVER_PATH} from "../global/constants";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
type Socket = SocketIOClient.Socket;
@Injectable({
  providedIn: "root"
})
export class SocketService {
  private socket: Socket;
  public constructor() {
    try {
      this.socket = ClientSocketIO(BASE_SERVER_PATH);
    } catch (e) {
      alert("Server is not available at the moment.");
    }
  }

  public getSocketId(): string {
    return this.socket.id;
  }

  public addEvent( eventName: string, eventFunction: (iD?: string | IGame | IGame3D) => void): void {
    this.socket.on(eventName, eventFunction);
  }

  public emitEvent<T>(eventName: string, data?: T): void {
    this.socket.emit(eventName, data);
  }

  public unsubscribeTo(eventName: string): void {
    this.socket.off(eventName);
  }
}
