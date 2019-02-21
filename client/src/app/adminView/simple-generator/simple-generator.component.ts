import { Component, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import { ISimpleForm } from "../../../../../common/models/game";
import { ModalService } from "src/app/services/modal.service";
import { Message, ERROR_ID } from "../../../../../common/communication/message";
import { FileValidatorService } from "src/app/services/file-validator.service";
import { IModal } from "src/app/models/modal";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"],
})

export class SimpleGeneratorComponent implements OnInit, OnDestroy, IModal {

  public readonly ID_MODIFIED_FILE: string = "modifiedFile";
  public readonly ID_MODIFIED_FILENAME: string = "modifiedFileName";
  public readonly ID_ORIGINAL_FILE: string = "originalFile";
  public readonly ID_ORIGINAL_FILENAME: string = "originalFileName";
  public readonly VALID_FILE_EXTENSION: string = "image/bmp";
  public GAME_ID: number = 1;

  private readonly WIDTH_OFFSET: number = 18;
  private readonly HEIGHT_OFFSET: number = 22;
  private modifiedFileIsOK: boolean;
  private originalFileIsOK: boolean;

  private element: HTMLElement;
  @Input() public id: string;
  private modalRef: SimpleGeneratorComponent;
  public gameName: string;

  public constructor(private gameService: GameService, private fileValidator: FileValidatorService,
                     private modalService: ModalService, public el: ElementRef) {
    this.element = el.nativeElement;
    this.modifiedFileIsOK = false;
    this.originalFileIsOK = false;
    this.gameName = "";
  }

  public ngOnInit(): void {
    this.initModal();
  }

  public ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();

  }

  private onFileLoaded(reader: FileReader): boolean {

    const buffer: ArrayBuffer = reader.result as ArrayBuffer;
    const bmp: DataView = new DataView(buffer);
    const width: number = bmp.getUint32(this.WIDTH_OFFSET, true);
    const height: number = bmp.getUint32(this.HEIGHT_OFFSET, true);

    return this.fileValidator.dimensionsAreValid(width, height);
  }

  public onFileChange(file: File, fileId: string, labelId: string): void {

    const fileName: string = file.name;
    (document.getElementById(labelId) as HTMLParagraphElement).textContent = fileName;
    const reader: FileReader = new FileReader();
    if (file && file.type === this.VALID_FILE_EXTENSION) {
      let validFile: boolean = false;
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        validFile = this.onFileLoaded(reader);
        this.updateValidFiles(fileId, validFile);
      };
    } else {
      this.updateValidFiles(fileId, false);
    }
  }

  private updateValidFiles(fileId: string, value: boolean): void {
    if (fileId === this.ID_ORIGINAL_FILE) {
      this.originalFileIsOK = value;
    } else {
      if (fileId === this.ID_MODIFIED_FILE) {
        this.modifiedFileIsOK = value;
      }
    }
  }

  public submit(): boolean {
    this.clearErrorMessages();
    if (this.modifiedFileIsOK && this.originalFileIsOK && this.fileValidator.isValidGameName(this.gameName)) {
      const file1: File = (document.getElementById(this.ID_ORIGINAL_FILE) as HTMLInputElement).files[0];
      const file2: File = (document.getElementById(this.ID_MODIFIED_FILE) as HTMLInputElement).files[0];
      const newGame: ISimpleForm = { id: this.GAME_ID, name: this.gameName, originalImage: file1, modifiedImage: file2 };
      this.GAME_ID ++;
      this.gameService.createSimpleGame(newGame).subscribe((message: Message) => {
        if (message.title === ERROR_ID) {
          this.showErrorMessage("L'opération a été annulée: ");
          this.showErrorMessage(message.body);
        } else {
          this.close();

          return true;
        }
      });
    } else {
      this.validity(this.fileValidator.isValidGameName(this.gameName), "gameNameLabel", "Nom de jeu invalide.");
      this.validity(this.modifiedFileIsOK, this.ID_MODIFIED_FILE, "Fichier de jeu modifié invalide.");
      this.validity(this.originalFileIsOK, this.ID_ORIGINAL_FILE, "Fichier de jeu original invalide.");
    }

    return false;
  }

  private resetForm(): void {
    document.getElementById(this.ID_ORIGINAL_FILENAME).textContent = "Aucun fichier choisi.";
    document.getElementById(this.ID_MODIFIED_FILENAME).textContent = "Aucun fichier choisi.";
    this.gameName = "";
    this.modifiedFileIsOK = false;
    this.originalFileIsOK = false;
    this.resetErrors(["gameNameLabel", this.ID_MODIFIED_FILENAME, this.ID_ORIGINAL_FILENAME]);
    this.clearErrorMessages();
  }

  private resetErrors(ids: string[]): void {

    for (const id of ids) {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "black";
    }
  }

  private validity(condition: boolean, id: string, errorMessage: string): void {

    if (condition) {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "black";
    } else {
      (document.getElementById(id) as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage(errorMessage);
    }
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

  private initModal(): void {
    this.modalRef = this;

    document.body.appendChild(this.element);

    this.element.addEventListener("click", (event: Event) => {
      if (event.constructor.name === "modal") {
        this.modalRef.submit();
      }
    });

    this.modalService.add(this);

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
