import {Component, OnInit} from "@angular/core";
import {IndexService} from "../services/index.service";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";
import { Router} from "@angular/router";

@Component({
  selector: "app-initial",
  templateUrl: "./initial.component.html",
  styleUrls: ["./initial.component.css"]
})
export class InitialComponent implements OnInit {
  public username: string;
  public readonly MESSAGE_BOX_ID: string = "message_box";

  public constructor(private indexService: IndexService, private router: Router) {
    this.username = ""; // invalid name
  }

  public ngOnInit() {
  }
  public connect(username: string): void {
    this.indexService.connect(this.username).subscribe((message: Message) => {
      if (message.title === ERROR_ID ) {
        this.showErrorMessage(message.body);
      }
      if (message.title === BASE_ID) {
        this.router.navigate(["games"]);
      }
    });
  }
  private showErrorMessage(message: string): void {
    const errorBox: HTMLElement = document.getElementById(this.MESSAGE_BOX_ID) as HTMLElement;

    // DEMANDER POUR JQUERY
    errorBox.textContent = message;
    errorBox.style.opacity = "1";
  }

}
