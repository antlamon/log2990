import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { IModal } from "src/app/models/modal";
import { IGame3DForm } from "../../../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, THEMATIC_TYPE_NAME } from "../../../../../common/models/game3D";
import { FileValidatorService } from "src/app/services/file-validator.service";
import { Message, ERROR_ID } from "../../../../../common/communication/message";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy, IModal {
  public gameName: string;
  public noObj: string;
  @Input() public id: string;
  public nbModification: number = 3;
  public type1: string;
  public type2: string;

  private modalRef: FreeGeneratorComponent;
  private element: HTMLElement;
  private modification: boolean[];
  private selectedType: string;

  public constructor(
    private gameService: GameService,
    private fileValidator: FileValidatorService,
    public el: ElementRef, private modal: ModalService) {
      this.element = el.nativeElement;
      this.gameName = "";
      this.noObj = "";
      this.modification = new Array(this.nbModification).fill(false);
      this.type1 = GEOMETRIC_TYPE_NAME;
      this.type2 = THEMATIC_TYPE_NAME;
      this.selectedType = this.type1;
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

    if (this.fileValidator.isValidGameName(this.gameName) &&
        this.fileValidator.isValidObjNb(this.noObj) &&
        this.hasModifications()) {
      const newGame: IGame3DForm = {
        name: this.gameName,
        objectType: this.selectedType,
        objectQty: +this.noObj,
        modifications: {add: this.modification[0], delete: this.modification[1], color: this.modification[this.nbModification - 1]}
      };
      this.gameService.createFreeGame(newGame).subscribe((message: Message) => {
        if (message.title === ERROR_ID) {
          this.showErrorMessage("L'opération a été annulée: ");
          this.showErrorMessage(message.body);
        } else {
          this.close();

          return true;
        }
      });
    } else {
      this.validity(this.fileValidator.isValidGameName(this.gameName), "gameName", "Nom de jeu invalide.");
      this.validity(this.fileValidator.isValidObjNb(this.noObj), "noObj", "Le nombre d'objet doit être entre 10 et 200.");
      this.validity(this.hasModifications(), "typeModif", "Il faut choisir au moins un type de modifications.");
    }
  }

  private resetErrors(ids: string[]): void {

    for (const id of ids) {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "black";
    }
  }
  public hasModifications(): boolean {
    return this.modification.includes(true);

  }
  public changeModif( nModif: number): void {
    if (nModif >= 0 && nModif < this.nbModification) {
      this.modification[nModif] = !this.modification[nModif];
    }
  }

  public changeType(newType: string): void {
    this.selectedType = newType;
  }

  public open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  public close(): void {
    this.resetForm();
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
    document.getElementById("errorMessages").appendChild(errorBox);
  }

  private clearErrorMessages(): void {
    const errors: HTMLElement = document.getElementById("errorMessages");
    while (errors.hasChildNodes()) {
      errors.removeChild(errors.firstChild);
    }
  }
  private resetForm(): void {
    this.noObj = "";
    this.gameName = "";
    this.clearErrorMessages();
    this.resetErrors(["gameName", "noObj", "typeModif"]);
  }
}
