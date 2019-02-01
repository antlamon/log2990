import { Injectable } from "@angular/core";
import { IGame } from "../../../common/models/game";
import { Observable, of } from "rxjs";
import { catchError } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";


@Injectable({
  providedIn: "root"
})
export class GameService {

  private readonly GAMES_URL: string = "http://localhost:3000/api/gameList";
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


  public createSimpleGame(game: IGame): void {

    console.log("envoi de la requete au serveur...");
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.http.post<IGame>(this.SIMPLE_URL, game, httpOptions).subscribe();
  }
  

  public createFreeGame(game: IGame): void {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json'
      })
    };

    this.http.post<IGame>(this.FREE_URL, game, httpOptions).subscribe();
  }

  public deleteSimpleGame(game: IGame): void {
    // return this.http.delete(this.SIMPLE_URL, game);
  }

  public deleteFreeGame(game: IGame): void {
    // return this.http.delete(this.FREE_URL, game);
  }

}
