import { Component, ViewChild } from "@angular/core";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { ModalService } from "../../services/modal.service";

@Component({
  selector: "app-admin-menu",
  templateUrl: "./admin-menu.component.html",
  styleUrls: ["./admin-menu.component.css"],
})

export class AdminMenuComponent {

  @ViewChild(ListViewComponent) public games: ListViewComponent;

  public constructor(private modalService: ModalService) {}

  public openSimpleDialog(id: string): void {
    this.modalService.open(id);
  }

  public openFreeDialog(id: string): void {
    this.modalService.open(id);
  }

}
