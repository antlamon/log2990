import { Component, OnInit } from '@angular/core';
import { GameService } from "../../services/game.service";
import { IGame } from "../../../../../common/models/game";

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  
  public simpleGame: IGame;
  
  constructor(private gameService: GameService) { }

  ngOnInit() {
    this.getSimpleGame();
  }

  public getSimpleGame(): void {
    this.gameService.getSimpleGame(999)
        .then((response: IGame) => this.simpleGame = response[0] );
  }

}
