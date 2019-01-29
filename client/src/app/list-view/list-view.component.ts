import { Component, OnInit } from '@angular/core';
import {Game} from '../model/game';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.css']
})
export class ListViewComponent implements OnInit {

  simpleGames: Game[];
  freeGames: Game[];

  constructor() { 
    //mock data
    this.simpleGames = [ new Game("Nissan Patrol", "image Patrol URL"),
                         new Game("Jello", "image jello URL"), 
                         new Game("Apple Pie", "image apple URL"),
                         new Game("Lemon Pie", "image lemon URL"),
                         new Game("Cake Patrol", "image cake URL")];

    this.multiGames = [ new Game("Nissan Patrol", "image Patrol URL"),
                         new Game("Jello", "image jello URL"), 
                         new Game("Apple Pie", "image apple URL"),
                         new Game("Lemon Pie", "image lemon URL"),
                         new Game("Cake Patrol", "image cake URL")];


  }

  ngOnInit() {
  }

}
