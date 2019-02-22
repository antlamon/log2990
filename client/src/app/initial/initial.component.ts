import {Component} from "@angular/core";
import {IndexService} from "../services/index.service";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";
import { Router} from "@angular/router";
import { FileValidatorService } from "../services/file-validator.service";

@Component({
  selector: "app-initial",
  templateUrl: "./initial.component.html",
  styleUrls: ["./initial.component.css"]
})
export class InitialComponent {
  public username: string;
  public readonly MESSAGE_BOX_ID: string = "message_box";

  public constructor(private indexService: IndexService, private router: Router, private fileValidator: FileValidatorService) {
    this.username = ""; // invalid name
  }

  public connect(username: string): void {
    if (this.fileValidator.isValidName(username)) {
      this.indexService.connect(this.username).subscribe((message: Message) => {
        if (message.title === ERROR_ID ) {
          this.showErrorMessage(message.body);
        }
        if (message.title === BASE_ID) {
          this.router.navigate(["games"]);
        }
      });
    } else {
      this.showErrorMessage("Le username n'est pas valide");
    }
  }

  private showErrorMessage(message: string): void {
    const errorBox: HTMLElement = document.getElementById(this.MESSAGE_BOX_ID) as HTMLElement;

    errorBox.textContent = message;
    errorBox.style.opacity = "1";
  }

}
