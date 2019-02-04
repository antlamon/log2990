import { Injectable } from "@angular/core";
import * as ClientSocketIO from "socket.io-client";
type Socket = SocketIOClient.Socket;
@Injectable({
  providedIn: "root"
})
export class SocketService {
  private readonly socket: Socket;
  public constructor() {
    try {
      this.socket = ClientSocketIO("http://localhost:3000/");
    } catch (e) {
      alert("Server is not available at the moment.");
    }
  }
  public getSocketId(): string {
    return this.socket.id;
  }
  public addEvent( eventName: string, eventFunction: () => any): void {
    this.socket.on(eventName, eventFunction);
  }
}
