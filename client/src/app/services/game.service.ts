import { Injectable } from "@angular/core";
import { IGame, ISimpleForm } from "../../../../common/models/game";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Message } from "../../../../common/communication/message";
import { BASE_SERVER_PATH } from "../global/constants";

@Injectable({
  providedIn: "root"
})
export class GameService {

  private readonly GAMES_URL: string = BASE_SERVER_PATH +"api/gameList";
  private readonly SIMPLE_URL: string = this.GAMES_URL + "/simple";
  private readonly FREE_URL: string = this.GAMES_URL + "/free";

  public constructor(private http: HttpClient) {
  }

  public getSimpleGames():  Observable<IGame[]> {
    return this.http.get<IGame[]>(this.SIMPLE_URL).pipe(
      catchError(this.handleError<IGame[]>("getSimpleGames"))
    );
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
        return of(result as T);
    };
  }
  public getFreeGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.FREE_URL);
  }
  public createSimpleGame(game: ISimpleForm): void {

    console.log("envoi de la requete au serveur...");
    const form: FormData = new FormData();
    form.append("name", game.name)
    form.append("originalImage", game.originalImage, game.originalImage.name);
    form.append("modifiedImage", game.modifiedImage, game.modifiedImage.name);
    this.http.post<Message>(this.SIMPLE_URL, form).subscribe();
  }
  

  public createFreeGame(game: IGame): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.http.post<Message>(this.FREE_URL, game, httpOptions).subscribe();
  }

  public deleteSimpleGame(game: IGame): Observable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const url = this.SIMPLE_URL+ "?name=" + game.name;

    return this.http.delete(url, httpOptions);
  }

  public deleteFreeGame(game: IGame): Observable<{}> {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };
    const url = this.SIMPLE_URL+ "?name=" + game.name;

     return this.http.delete(url, httpOptions);
  }

}
