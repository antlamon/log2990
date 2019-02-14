import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { IModal } from "src/app/models/modal";
import { IGame3DForm } from "../../../../../common/models/game";
import { FileValidatorService } from "src/app/services/file-validator.service";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy, IModal {

  private modalRef: FreeGeneratorComponent;

  private element: HTMLElement;
  @Input() public id: string;

  public gameName: string;

  public noObj: string;

  public constructor(
    private gameService: GameService,
    private fileValidator: FileValidatorService,
    public el: ElementRef, private modal: ModalService) {
      this.element = el.nativeElement;
      this.gameName = "";
      this.noObj = "";
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
    this.clearErrorMessages();
    
    if(this.fileValidator.isValidGameName(this.gameName)) {
      const newGame: IGame3DForm = {
        name: "new 3D game",
        objectType: "geometric",
        objectQty: 150,
        modifications: {add: true, delete: true, color: true} 
      };
      this.gameService.createFreeGame(newGame);
      this.close();
    } else {
      this.validity(this.fileValidator.isValidGameName(this.gameName), "gameNameLabel", "Nom de jeu invalide.");

    }
  }

  public open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  public close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  private validity(condition: boolean, id: string, errorMessage: string): void {

    if (condition) {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "black";
    } else {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage(errorMessage);
    }
  }
  private showErrorMessage(error: string): void {
    const errorBox: HTMLElement = document.createElement("span");
    const errorMessage: Text = document.createTextNode(error);
    errorBox.appendChild(errorMessage);
    document.getElementById("errorsMessages").appendChild(errorBox);
  }

  private clearErrorMessages(): void {
    const errors: HTMLElement = document.getElementById("errorsMessages");
    while (errors.hasChildNodes()) {
      errors.removeChild(errors.firstChild);
    }
  }
}