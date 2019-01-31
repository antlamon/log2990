import { Component, OnInit } from "@angular/core";
import { Router} from "@angular/router";
import { GameService } from "src/app/game.service";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"]
})
export class SimpleGeneratorComponent implements OnInit {

  public constructor(private router: Router, private gameService: GameService) {}

  public ngOnInit() {  }

  public submit() {
    // submit form ... 
    let newGame = {name: "NouveauJeu", imageURL: "nouveauTest.bmp", 
                    solo:{first: 9999, second: 9999, third: 9999}, 
                    multi:{first: 9999, second: 9999, third: 9999}};//for tests
    this.gameService.createSimpleGame(newGame);
    console.log("tentative de creer un jeu ... ");

    this.router.navigate(["admin"]); // go back to admin home
  }

  close() {
    this.router.navigate(["admin"]); // go back to admin home
  }

}
