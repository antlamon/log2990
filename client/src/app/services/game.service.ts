import { Injectable } from "@angular/core";
import { IGame, ISimpleForm, IGame3DForm, IFullGame } from "../../../../common/models/game";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Message } from "../../../../common/communication/message";
import { BASE_SERVER_PATH } from "../global/constants";
import { Game3D } from "../../../../common/models/game3D";

@Injectable({
  providedIn: "root"
})
export class GameService {

  private readonly GAMES_URL: string = BASE_SERVER_PATH + "api/gameList";
  private readonly SIMPLE_URL: string = this.GAMES_URL + "/simple";
  private readonly SIMPLEONE_URL: string = this.GAMES_URL + "/onesimple";
  private readonly FREE_URL: string = this.GAMES_URL + "/free";
  private readonly FREEONE_URL: string = this.GAMES_URL + "/onefree";

  public constructor(private http: HttpClient) {
  }

  public getSimpleGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.SIMPLE_URL).pipe(
      catchError(this.handleError<IGame[]>("getSimpleGames"))
    );
  }

  public async getSimpleGame(id: string): Promise<IFullGame> {
    const url: string = this.SIMPLEONE_URL + "?id=" + id;
    (console as Console).log(url);

    return this.http.get<IFullGame>(url).pipe(
      catchError(this.handleError<IFullGame>("getSimpleGame"))
    ).toPromise();
  }

  private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
    return (error: Error): Observable<T> => {
      return of(result as T);
    };
  }

  public getFreeGames(): Observable<Game3D[]> {
    return this.http.get<Game3D[]>(this.FREE_URL);
  }

  public get3DGame(id: string): Promise<Game3D> {
    const url: string = this.FREEONE_URL + "?id=" + id;
    (console as Console).log(url);

    return this.http.get<Game3D>(url).pipe(
      catchError(this.handleError<Game3D>("get3DGame"))
    ).toPromise();
  }

  public createSimpleGame(game: ISimpleForm): Observable<Message> {

    const form: FormData = new FormData();
    form.append("name", game.name);
    form.append("originalImage", game.originalImage, game.originalImage.name);
    form.append("modifiedImage", game.modifiedImage, game.modifiedImage.name);

    return this.http.post<Message>(this.SIMPLE_URL, form).pipe(
      catchError(this.handleError<Message>("createSimpleGame"))
    );

  }

  public createFreeGame(game: IGame3DForm): Observable<Message> {
    // tslint:disable-next-line:typedef
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };

    return this.http.post<Message>(this.FREE_URL, game, httpOptions).pipe(
      catchError(this.handleError<Message>("createFreeGame"))
    );

  }

  public deleteSimpleGame(game: IGame): Observable<{}> {
    // tslint:disable-next-line:typedef
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const url: string = this.SIMPLE_URL + "?id=" + game.id;

    return this.http.delete(url, httpOptions);
  }

  public deleteFreeGame(game: Game3D): Observable<{}> {
    // tslint:disable-next-line:typedef
    const httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json"
      })
    };
    const url: string = this.FREE_URL + "?id=" + game.id;

    return this.http.delete(url, httpOptions);
  }
}
