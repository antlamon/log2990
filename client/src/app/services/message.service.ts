import { Injectable } from "@angular/core";
import { IGameMessage, IMessageForm } from "../../../../common/models/simpleGameMessage";
import { Observable, of } from "rxjs";
import { BASE_SERVER_PATH } from "../global/constants";
import { catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Message } from "../../../../common/communication/message";

@Injectable({
  providedIn: "root"
})
export class MessageService {

  private readonly MESSAGES_URL: string = BASE_SERVER_PATH + "api/gameMessage";
  private readonly GAME_MESSAGE_URL: string = this.MESSAGES_URL + "/message";

  public constructor(private http: HttpClient) { }

  public getMessages(): Observable<IGameMessage[]> {
    return this.http.get<IGameMessage[]>(this.GAME_MESSAGE_URL).pipe(
      catchError(this.handleError<IGameMessage[]>("getMessages"))
    );

  }

  public sendMessage(msg: IMessageForm): Observable<Message> {
    const today: Date = new Date();
    const time: string = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    const form: FormData = new FormData();
    form.append("eventType", msg.eventType);
    form.append("time", time);
    form.append("username", msg.username);

    console.log(this.GAME_MESSAGE_URL);

    return this.http.post<Message>(this.GAME_MESSAGE_URL, form).pipe(
      catchError(this.handleError<Message>("sendMessage"))
    );

  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }

}
