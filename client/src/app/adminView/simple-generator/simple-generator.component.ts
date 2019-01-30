import { Component, OnInit } from "@angular/core";
import { Router} from "@angular/router";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"]
})
export class SimpleGeneratorComponent implements OnInit {

  public constructor(private router: Router) {}

  public ngOnInit() {  }

  public submit() {
    // submit form ... 
    
    this.router.navigate(["admin"]); // go back to admin home
  }

  close() {
    this.router.navigate(["admin"]); // go back to admin home
  }

}
