import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { BASE_ID, ERROR_ID, Message } from "../../../../common/communication/message";
import { FileValidatorService } from "../services/file-validator.service";
import { IndexService } from "../services/index.service";
import {GAMES_LIST_PATH} from "../../app/global/constants";
@Component({
  selector: "app-initial",
  templateUrl: "./initial.component.html",
  styleUrls: ["./initial.component.css"]
})
export class InitialComponent {
  public readonly MESSAGE_BOX_ID: string = "message_box";
  public username: string;
  private errors: string[];

  public constructor(
    private indexService: IndexService,
    private router: Router,
    private fileValidator: FileValidatorService,
  ) {
    this.username = "";
    this.errors = [];
  }

  public connect(username: string): void {
    this.errors = [];
    if (this.fileValidator.isValidName(username)) {
      this.indexService.connect(this.username).subscribe((message: Message) => {
        if (message.title === ERROR_ID ) {
          this.errors.push(message.body);
        }
        if (message.title === BASE_ID) {
          this.router.navigate([GAMES_LIST_PATH]).catch((error: Error) => console.error(error.message));
        }
      });
    } else {
      this.errors.push("Le username n'est pas valide");
    }
  }
}
