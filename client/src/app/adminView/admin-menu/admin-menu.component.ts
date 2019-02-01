import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { Router, ActivatedRoute} from "@angular/router";
import { ListViewComponent } from "src/app/list-view/list-view.component";

@Component({
  selector: "app-admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ["./admin-menu.component.css"],
})

export class AdminMenuComponent implements AfterViewInit {
  
  @ViewChild(ListViewComponent) games: ListViewComponent;
  
  ngAfterViewInit(): void {
    this.games.isAdminMode = true;
  }

  public constructor(private router: Router, private route: ActivatedRoute) {

  }

  public openFreeViewForm() {
    this.router.navigate(["freegen"], {relativeTo: this.route});
  }

  public openSimpleViewForm() {
    this.router.navigate(["simplegen"], {relativeTo: this.route});
  }

}
