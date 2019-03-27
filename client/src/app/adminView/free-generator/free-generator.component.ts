import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ModalService } from "src/app/services/modal.service";
import { IModal } from "src/app/models/modal";
import { IGame3DForm } from "../../../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, THEMATIC_TYPE_NAME, NO_MAX_OBJECTS, NO_MIN_OBJECTS } from "../../../../../common/models/game3D";
import { FileValidatorService } from "src/app/services/file-validator.service";
import { Message, ERROR_ID } from "../../../../../common/communication/message";
@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy, IModal {

  private gameName: string;
  private noObj: string;
  @Input() public id: string;
  private types: string[];
  private maxObj: number = NO_MAX_OBJECTS;
  private minObj: number = NO_MIN_OBJECTS;
  private addCheckbox: boolean;
  private deleteCheckbox: boolean;
  private colorCheckbox: boolean;
  private modalRef: FreeGeneratorComponent;
  private element: HTMLElement;
  private selectedType: string;
  private errorsMessages: string[];

  public constructor(
    private gameService: GameService,
    private fileValidator: FileValidatorService,
    public el: ElementRef, private modal: ModalService) {
      this.element = el.nativeElement;
      this.addCheckbox = false;
      this.deleteCheckbox = false;
      this.colorCheckbox = false;
      this.gameName = "";
      this.noObj = "";
      this.types = [GEOMETRIC_TYPE_NAME, THEMATIC_TYPE_NAME];
      this.selectedType = this.types[0];
      this.errorsMessages = [];
  }

  public ngOnInit(): void {
    this.modalRef = this;
    if (!this.id) {
      return;
    }
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
    this.errorsMessages = [];

    if (this.fileValidator.isValidGameName(this.gameName) &&
        this.fileValidator.isValidObjNb(this.noObj) &&
        this.hasModifications()) {
      const newGame: IGame3DForm = {
        name: this.gameName,
        objectType: this.selectedType,
        objectQty: +this.noObj,
        modifications: {add: this.addCheckbox, delete: this.deleteCheckbox, color: this.colorCheckbox}
      };
      this.gameService.createFreeGame(newGame).subscribe((message: Message) => {
        if (message.title === ERROR_ID) {
          this.errorsMessages.push("L'opération a été annulée: ");
          this.errorsMessages.push(message.body);
        } else {
          this.close();

          return true;
        }
      });
    } else {
      this.showErrors();
    }
  }
  private showErrors(): void {
    if (!this.hasModifications()) {
      this.errorsMessages.push(`Il faut choisir au moins un type de modifications.`);
    }
    if (!this.fileValidator.isValidObjNb(this.noObj)) {
      this.errorsMessages.push(`Le nombre d'objet doit être entre ${this.minObj} et ${this.maxObj}`);
    }
    if (!this.fileValidator.isValidGameName(this.gameName)) {
      this.errorsMessages.push(`Le nom ${this.gameName} est invalide`);
    }
  }

  public hasModifications(): boolean {
    return this.colorCheckbox || this.addCheckbox || this.deleteCheckbox;

  }

  public changeType(newType: string): void {
    this.selectedType = newType;
  }

  public open(): void {
    this.element.style.display = "block";
  }

  public close(): void {
    this.resetForm();
    this.element.style.display = "none";
  }

  private resetForm(): void {
    this.noObj = "";
    this.gameName = "";
    this.errorsMessages = [];
    this.addCheckbox = false;
    this.deleteCheckbox = false;
    this.colorCheckbox = false;
  }
}
