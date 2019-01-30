import { Injectable } from '@angular/core';
import { Game } from './model/game';
import { Observable, of } from 'rxjs';
//import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  //private readonly GAMES_URL: string = "http://localhost:3000/api/games";
  //private readonly SIMPLE_URL: string = this.GAMES_URL + "/simple";
  //private readonly FREE_URL: string = this.GAMES_URL + "/free";

  constructor(/*private http: HttpClient*/) { 
  }

  public getSimpleGames():  Observable<Game[]> {
    let fakeGames = [ new Game("Nissan Patrol", "1.bmp"),
    new Game("Jello", "1.bmp"), 
    new Game("Apple Pie", "1.bmp"),
    new Game("Lemon Pie", "1.bmp"),
    new Game("Cake Patrol", "1.bmp")];
    return of(fakeGames);

    //return this.http.get<Game[]>(this.SIMPLE_URL);
  }

  public getFreeGames(): Observable<Game[]> {
    let fakeGames = [ new Game("Nissan Patrol", "1.bmp"),
    new Game("Jello", "1.bmp"), 
    new Game("Apple Pie", "1.bmp"),
    new Game("Lemon Pie", "1.bmp"),
    new Game("Cake Patrol", "1.bmp")];
    return of(fakeGames);

    //return this.http.get<Game[]>(this.FREE_URL);
  }

  public createSimpleGame(game:Game):void {
    //return this.http.post(this.SIMPLE_URL, game);
  }

  public createFreeGame(game:Game):void {
    //return this.http.post(this.FREE_URL, game);
  }

  public deleteSimpleGame(game:Game):void {
    //return this.http.delete(this.SIMPLE_URL, game);
  }

  public deleteFreeGame(game:Game):void {
    //return this.http.delete(this.FREE_URL, game);
  }


}
