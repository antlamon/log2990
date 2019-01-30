import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";

import { Message } from "../../../common/communication/message";
import {SocketService} from "./socket.service";

@Injectable()
export class IndexService {

    private readonly BASE_URL: string = "http://localhost:3000/api/index";
    private readonly CONNECT_URL: string = "http://localhost:3000/api/connexion";
    private readonly DISCONNECT_URL: string = "http://localhost:3000/api/connexion/disconnect";
    public constructor(private http: HttpClient, private socketService: SocketService) { }
    public basicGet(): Observable<Message> {

        return this.http.get<Message>(this.BASE_URL).pipe(
            catchError(this.handleError<Message>("basicGet"))
        );
    }
    public connect(name: string): Observable<Message> {
      return this.http.get<Message>(this.CONNECT_URL + "?name=" + name + "&id=" + this.socketService.getSocketId()).pipe(
        catchError(this.handleError<Message>("connect"))
      );
    }
    public disconnect(name: string): Observable<Message> {
    return this.http.get<Message>(this.DISCONNECT_URL + "?name=" + name).pipe(
      catchError(this.handleError<Message>("disconnect"))
    );
  }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
