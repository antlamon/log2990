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

  private readonly WIDTH_OFFSET: number = 18;
  private readonly HEIGHT_OFFSET: number = 22;
  private modifiedFileIsOK: boolean;
  private originalFileIsOK: boolean;
  private gameName: string;

  private element: HTMLElement;
  @Input() public id: string;
  private modalRef: SimpleGeneratorComponent;
  private originalFileName: string;
  private modifiedFileName: string;
  private originalFile: File;
  private modifiedFile: File;
  private errorsMessages: string[];

  public constructor(
    private gameService: GameService,
    private fileValidator: FileValidatorService,
    private modalService: ModalService,
    public el: ElementRef) {

    this.element = el.nativeElement;
    this.modifiedFileIsOK = false;
    this.originalFileIsOK = false;
    this.gameName = "";
    this.errorsMessages = [];
  }

  public ngOnInit(): void {
    this.originalFileName = "Choisir un fichier";
    this.modifiedFileName = "Choisir un fichier";
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

  public onFileChange(file: File, fileId: string): void {

    if (fileId === this.ID_ORIGINAL_FILE) {
      this.originalFileName = file.name;
      this.originalFile = file;
    } else {
      this.modifiedFileName = file.name;
      this.modifiedFile = file;
    }
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
    this.errorsMessages = [];
    if (this.filesAreValid() && this.fileValidator.isValidGameName(this.gameName)) {
      const newGame: ISimpleForm = { name: this.gameName,
                                     originalImage: this.originalFile, modifiedImage: this.modifiedFile };
      this.gameService.createSimpleGame(newGame).subscribe((message: Message) => {
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

    return false;
  }
  private filesAreValid(): boolean {
    return this.modifiedFileIsOK && this.originalFileIsOK;
  }
  private showErrors(): void {
    if (!this.fileValidator.isValidGameName(this.gameName)) {
      this.errorsMessages.push(`Le nom ${this.gameName} est invalide`);
    }
    if (!this.originalFileIsOK) {
      this.errorsMessages.push(`Le fichier: [${this.originalFileName}] choisi pour l'image original est invalide`);
    }
    if (!this.modifiedFileIsOK) {
      this.errorsMessages.push(`Le fichier: [${this.modifiedFileName}] choisi pour l'image modifié est invalide`);
    }
  }

  private resetForm(): void {
    this.originalFileName = "Aucun fichier choisi.";
    this.modifiedFileName = "Aucun fichier choisi.";
    this.gameName = "";
    this.modifiedFileIsOK = false;
    this.originalFileIsOK = false;
    this.errorsMessages = [];
  }

  public open(): void {
    this.element.style.display = "block";

  }

  public close(): void {
    this.resetForm();
    this.element.style.display = "none";
  }

  private initModal(): void {
    this.modalRef = this;

    this.element.addEventListener("click", (event: Event) => {
      if (event.constructor.name === "modal") {
        this.modalRef.submit();
      }
    });

    this.modalService.add(this);
  }
}
