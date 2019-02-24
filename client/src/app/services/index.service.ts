import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { Message } from "../../../../common/communication/message";
import { BASE_SERVER_PATH } from "../global/constants";
import { SocketService } from "./socket.service";

@Injectable()
export class IndexService {

    public username: string;

    private readonly CONNECT_URL: string = BASE_SERVER_PATH + "api/connexion";

    public constructor(private http: HttpClient, private socketService: SocketService) { }
    public connect(name: string): Observable<Message> {
      this.username = name;

      return this.http.get<Message>(this.CONNECT_URL + "?name=" + name + "&id=" + this.socketService.getSocketId()).pipe(
        catchError(this.handleError<Message>("connect"))
      );
    }
    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
