import {Component} from "@angular/core";
import {IndexService} from "../services/index.service";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";
import { Router} from "@angular/router";
import { FileValidatorService } from "../services/file-validator.service";
import { NAVIGATE_ERROR } from "../global/clientError";

@Component({
  selector: "app-initial",
  templateUrl: "./initial.component.html",
  styleUrls: ["./initial.component.css"]
})
export class InitialComponent {
  public username: string;
  public readonly MESSAGE_BOX_ID: string = "message_box";
  private errors: string[];

  public constructor(private indexService: IndexService, private router: Router, private fileValidator: FileValidatorService) {
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
          this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
        }
      });
    } else {
      this.errors.push("Le username n'est pas valide");
    }
  }
}
