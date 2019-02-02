import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { MatDialog} from "@angular/material";
import { SimpleGeneratorComponent } from "../simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../free-generator/free-generator.component";

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

  public constructor(public dialog:MatDialog) {}

  public openSimpleDialog() {
    const dialogRef = this.dialog.open(SimpleGeneratorComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  public openFreeDialog() {
    const dialogRef = this.dialog.open(FreeGeneratorComponent);

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}
