import { Injectable } from "@angular/core";
import * as ClientSocketIO from "socket.io-client";
import {BASE_SERVER_PATH} from "../global/constants";
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
  public addEvent( eventName: string, eventFunction: () => {}): void {
    this.socket.on(eventName, eventFunction);
  }
}
