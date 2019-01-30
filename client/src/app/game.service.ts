import { Injectable } from '@angular/core';
import { Game } from './model/game';
import { Observable, of } from 'rxjs';
import { FreeGames } from './model/mock-freeGames';
import { SimpleGames } from './model/mock-simpleGames';

@Injectable({
  providedIn: 'root'
})
export class GameService {

  simpleGames: Observable<Game[]> ;
  freeGames: Observable<Game[]> ;

  constructor() { 
  }

  public getSimpleGames():  Observable<Game[]> {
    return of(SimpleGames);
  }

  public getFreeGames(): Observable<Game[]> {
    return of(FreeGames);
  }
}
