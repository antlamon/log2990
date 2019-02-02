import { Component, OnInit } from "@angular/core";
import { GameService } from "src/app/game.service";
import { MatDialogRef } from '@angular/material';

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit {

  public constructor( private gameService: GameService,
    private dialogRef: MatDialogRef<FreeGeneratorComponent>) {
  }

  public ngOnInit() {
  }

  public submit() {
    // submit form ... TODO sprint 2
    let newGame = {name: "NouveauJeu", imageURL: "nouveauTest.bmp", 
                    solo:{first: 9999, second: 9999, third: 9999}, 
                    multi:{first: 9999, second: 9999, third: 9999}};//for tests

    this.gameService.createFreeGame(newGame);
    this.close();
  }

  public close() {
    this.dialogRef.close();
  }

}
