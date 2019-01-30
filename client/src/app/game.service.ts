import { Injectable } from "@angular/core";
import { IGame } from "../../../common/models/game";
import { Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

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
    return this.http.get<IGame[]>(this.SIMPLE_URL);
  }

  public getFreeGames(): Observable<IGame[]> {
    return this.http.get<IGame[]>(this.FREE_URL);
  }

  public createSimpleGame(game: IGame): void {
    // return this.http.post(this.SIMPLE_URL, game);
  }

  public createFreeGame(game: IGame): void {
    // return this.http.post(this.FREE_URL, game);
  }

  public deleteSimpleGame(game: IGame): void {
    // return this.http.delete(this.SIMPLE_URL, game);
  }

  public deleteFreeGame(game: IGame): void {
    // return this.http.delete(this.FREE_URL, game);
  }

}
