import { Component, OnInit } from "@angular/core";
import { Message } from "../../../common/communication/message";
import { BasicService } from "./basic.service";


@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
    public constructor(private basicService: BasicService) {
    }

    public readonly title: string = "LOG2990";
    public message: string;


    public ngOnInit(): void {
      if (!this.message) { return; }
        this.basicService.basicGet().subscribe((message: Message) => this.message = message.title + message.body);
    }
}
