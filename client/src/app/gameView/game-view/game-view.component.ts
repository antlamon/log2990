import { Component, OnInit } from '@angular/core';
import { GameService } from "../services/game.service";
import { IGame } from "../../../../common/models/game";

@Component({
  selector: 'app-game-view',
  templateUrl: './game-view.component.html',
  styleUrls: ['./game-view.component.css']
})
export class GameViewComponent implements OnInit {
  public simpleGames: IGame[];
  
  constructor() { }

  ngOnInit() {
  }

}
