import { Component, OnInit } from "@angular/core";
import { Router} from "@angular/router";
import { GameService } from "src/app/game.service";
import { ISolo } from "../../../../../common/models/game";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"]
})
export class SimpleGeneratorComponent implements OnInit {

  public constructor(private router: Router, private gameService: GameService) {}

  public ngOnInit() {  }

  public submit(): void {
    // submit form ...
    const name: string = (document.getElementById("name") as HTMLInputElement).value;
    const file1: File = (document.getElementById("originalImage") as HTMLInputElement).files[0];
    const file2: File = (document.getElementById("modifiedImage") as HTMLInputElement).files[0];

    const newGame: ISolo = {name: name, originalImage: file1, modifiedImage: file2 };

    this.gameService.createSimpleGame(newGame);

    this.router.navigate(["admin"]); // go back to admin home
  }

  public close() {
    this.router.navigate(["admin"]); // go back to admin home
  }

}
