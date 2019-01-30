import { Injectable } from '@angular/core';
import * as ClientSocketIO from 'socket.io-client';
type Socket = SocketIOClient.Socket;
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket;
  public constructor() {
    try {
      this.socket = ClientSocketIO('http://localhost:3000/');
    } catch (e) {
    }
  }
  public getSocketId(): string {
    return this.socket.id;
  }
}
