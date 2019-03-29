import { Component } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-waiting",
  templateUrl: "./waiting.component.html",
  styleUrls: ["./waiting.component.css"]
})
export class WaitingComponent {
  public constructor (private router: Router) { }

  public cancel(): void {
    this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
  }
}
