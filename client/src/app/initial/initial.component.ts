import {Component, OnInit} from "@angular/core";
import {IndexService} from "../index.service";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";
@Component({
  selector: "app-initial",
  templateUrl: "./initial.component.html",
  styleUrls: ["./initial.component.css"]
})
export class InitialComponent implements OnInit {
  public username: string;
  public readonly MESSAGE_BOX_ID: string = "message_box";

  public constructor(private basicService: IndexService) {
    this.username = ""; // invalid name
    // Mock values for testing
  }

  public ngOnInit() {
  }
  public connect(username: string): void {
    this.basicService.connect(this.username).subscribe((message: Message) => {
      if (message.title === ERROR_ID ) {
        this.showErrorMessage(message.body);
      }
      if (message.title === BASE_ID) {
        this.showErrorMessage("");
        console.log("change view");
      }
    });
  }
  private showErrorMessage(message: string): void {
    const errorBox: HTMLElement = document.getElementById(this.MESSAGE_BOX_ID) as HTMLElement;

    // DEMANDER POUR JQUERY
    errorBox.textContent = message;
    errorBox.style.opacity = "1";
  }

/*  @HostListener('window:beforeunload', ['$event']) public disconnect($event: Event): void {
    ($event).returnValue = true;
    this.basicService.disconnect(this.username).subscribe((message: Message) => {
    });
  }*/
}
