import { Injectable } from '@angular/core';
import * as ClientSocketIO from "socket.io-client";

type Socket = SocketIOClient.Socket;
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private static readonly socket: Socket = ClientSocketIO("http://localhost:3000/");

  public static getSocketId(): string {
    return this.socket.id;
  }
  public static IsOk(): void {
    console.log(SocketService.socket);
  }
}
