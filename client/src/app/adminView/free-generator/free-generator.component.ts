import { Component, OnInit } from "@angular/core";
import { Router} from "@angular/router";
import { GameService } from "src/app/game.service";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit {

  public constructor(private router: Router, private gameService: GameService) {
  }

  public ngOnInit() {
  }

  public submit() {
    // submit form ... TODO
    let newGame = {name: "NouveauJeu", imageURL: "nouveauTest.bmp", 
                    solo:{first: 9999, second: 9999, third: 9999}, 
                    multi:{first: 9999, second: 9999, third: 9999}};//for tests

    this.gameService.createFreeGame(newGame);
    this.close();
  }

  public close() {
    this.router.navigate(["admin"]); // go back to admin home
  }

}
