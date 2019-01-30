import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { Game } from '../model/game';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  simpleGames: Game[];
  freeGames: Game[];

  constructor(private gameService: GameService) { 

  }

  ngOnInit() {
    this.getSimpleGames();
    this.getFreeGames();
  }


  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe(simpleGames => this.simpleGames = simpleGames);
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe(freeGames => this.freeGames = freeGames);
  }

}
