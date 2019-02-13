import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { IModal } from "src/app/models/modal";
import { IGame3DForm } from "../../../../../common/models/game";
import { Router } from "@angular/router";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy, IModal {

  private modalRef: FreeGeneratorComponent;

  private element: HTMLElement;
  @Input() public id: string;

  public constructor(private router: Router,
    private gameService: GameService,
                     public el: ElementRef, private modal: ModalService) {
      this.element = el.nativeElement;
  }

  public ngOnInit(): void {
    this.modalRef = this;
    if (!this.id) {
      return;
    }

    document.body.appendChild(this.element);

    this.element.addEventListener("click", (e: Event) => {
      if (e.target.constructor.name === "modal") {
        this.modalRef.submit();
      }
    });

    this.modal.add(this);
  }

  public ngOnDestroy(): void {
    this.modal.remove(this.id);
    this.element.remove();

  }
  public submit(): void {
    //mock 3D game
    const newGame: IGame3DForm = {
      name: "new 3D game",
      objectType: "geometric",
      objectQty: 10,
      modifications: {add: true, delete: true, color: true} 
    };
    this.gameService.createFreeGame(newGame);
    this.close();
    this.router.navigate(["view3D"]);
  }

  public open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  public close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("modal-open");
  }
}
