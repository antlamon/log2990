import { Component, ViewChild, AfterViewInit } from "@angular/core";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { ModalService } from '../../modal.service';

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

  public constructor(private modalService:ModalService) {}

  public openSimpleDialog(id:string) {
    this.modalService.open(id);
  }

  public openFreeDialog(id:string) {
    this.modalService.close(id);
  }

}
