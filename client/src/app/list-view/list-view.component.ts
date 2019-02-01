import { Component, OnInit, Input} from '@angular/core';
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
  @Input() isAdminMode: Boolean;

  constructor(private gameService: GameService) {
    this.isAdminMode = false;
  }

  ngOnInit() {
    this.getSimpleGames();
    this.getFreeGames();
    this.isAdminMode = false;
  }


  public getSimpleGames(): void {
    this.gameService.getSimpleGames()
        .subscribe((response: IGame[]) => this.simpleGames = response);
  }

  public getFreeGames(): void {
    this.gameService.getFreeGames()
        .subscribe((response: IGame[]) => this.freeGames = response);
  }

}
