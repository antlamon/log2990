import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { IGame } from '../../../../common/models/game';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  private simpleGames: IGame[]; 
  private freeGames: IGame[];

  constructor(private gameService: GameService) {
  }

  ngOnInit() {
    this.getSimpleGames();
    this.getFreeGames();
  }


  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((simpleGames) => this.simpleGames = simpleGames);
        
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((freeGames) => this.freeGames = freeGames);
  }

}
