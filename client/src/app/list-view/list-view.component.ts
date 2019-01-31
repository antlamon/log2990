import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { IGame } from '../../../../common/models/game';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  public simpleGames: IGame[];
  public freeGames: IGame[];

  constructor(private gameService: GameService) {
    this.simpleGames = [];
  }

  ngOnInit() {
    this.getSimpleGames();
    this.getFreeGames();
  }


  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((response: IGame[]) => this.simpleGames = response);
    console.log(this.simpleGames);
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((freeGames) => this.freeGames = freeGames);
  }

}
