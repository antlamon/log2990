import { Component, Input } from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { GameService } from "../services/game.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-gamecard",
  templateUrl: "./gamecard.component.html",
  styleUrls: ["./gamecard.component.css"]
})
export class GamecardComponent {
  @Input()
  public game: IGame | IGame3D;
  @Input()
  public isAdminMode: boolean;
  //@Input()
  //public imgURL: string;
  public constructor(private gameService: GameService, private router: Router) {
    this.isAdminMode = false;
    this.game = {solo: [], multi: [], name: "", id: "", originalImage: ""};
   }

  public playSelectedGame(): void {
    if (this.isSimpleGame) {
       this.router.navigate(["simple-game/" + this.game.id]).catch((error: Error) => console.error(error.message));
    } else {
      this.router.navigate(["free-game/" + this.game.id]).catch((error: Error) => console.error(error.message));
    }
  }
  public deleteGame(): void {
    // tslint:disable-next-line:no-suspicious-comment
    // TODO: warning delete box "are you sure? yes/no"
    if (confirm("Voulez vous supprimer le jeu " + this.game.name + " ?")) {
      if (this.isSimpleGame) {
        this.gameService.deleteSimpleGame(this.game as IGame).subscribe();
      } else {
        this.gameService.deleteFreeGame(this.game as IGame3D).subscribe();
      }
    }
  }
  public get isSimpleGame(): boolean {
    return (this.game) && "originalImage" in this.game;
  }

}
