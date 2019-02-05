import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { IGame } from "../../../../../common/models/game";
import { IModal } from "src/app/models/modal";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy, IModal {

  private modalRef: FreeGeneratorComponent;

  private element: HTMLElement;
  @Input() public id: string;

  public constructor(private gameService: GameService,
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
    // submit form ...sprint 2
    const newGame: IGame  = {
      name: "NouveauJeu", imageURL: "nouveauTest.bmp",
      solo: { first: 9999, second: 9999, third: 9999 },
      multi: { first: 9999, second: 9999, third: 9999 }
    }; // for tests

    this.gameService.createFreeGame(newGame);
    this.close();
  }

   open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

   close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
