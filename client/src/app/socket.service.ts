import { Injectable } from '@angular/core';
import * as ClientSocketIO from "socket.io-client";
import {Component, OnInit} from "@angular/core";
type Socket = SocketIOClient.Socket;
@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private readonly socket: Socket;
  public constructor() {
    this.socket = ClientSocketIO("http://localhost:3000/");
  }
  public getSocketId(): string {
    return this.socket.id;
  }
}
