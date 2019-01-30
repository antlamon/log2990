import { Component, OnInit } from "@angular/core";
import { Router} from "@angular/router";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit {

  public constructor(private router: Router) {
  }

  public ngOnInit() {
  }

  public submit() {
    // submit form ... TODO
    this.router.navigate(["admin"]); // go back to admin home
  }

  public close() {
    this.router.navigate(["admin"]); // go back to admin home
  }

}
