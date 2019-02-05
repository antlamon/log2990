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

  private readonly WIDTH_OFFSET: number = 18;
  private readonly HEIGHT_OFFSET: number = 22;

  private modifiedFileIsOK: boolean = false;
  private originalFileIsOK: boolean = false;

  private element: HTMLElement;
  @Input() public id: string;

  public constructor(private gameService: GameService, private fileValidator: FileValidatorService,
                     private modalService: ModalService, public el: ElementRef) {
    this.element = el.nativeElement;
  }

  public ngOnInit(): void {
    this.initModal();
  }

  public ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();

  }

  public onFileChange(event: any, fileId: string, labelId: string): void {

    const fileName: string = (document.getElementById(fileId) as HTMLInputElement).value;
    (document.getElementById(labelId) as HTMLParagraphElement).textContent = fileName;
    const reader: FileReader = new FileReader();
    if (event.target.files && event.target.files.length && this.fileValidator.fileExtensionIsOK(fileName)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      reader.onload = () => {
        const buffer: ArrayBuffer = reader.result as ArrayBuffer;
        const bmp: DataView = new DataView(buffer);
        const width: number = bmp.getUint32(this.WIDTH_OFFSET, true);
        const height: number = bmp.getUint32(this.HEIGHT_OFFSET, true);
        if (this.fileValidator.dimensionsAreValid(width, height)) {
          if (fileId === "originalFile") {
            this.originalFileIsOK = true;
          } else {
            if (fileId === "modifiedFile") {
              this.modifiedFileIsOK = true;
            }
          }
        }
      };
    } else {
      if (fileId === "originalFile") {
        this.originalFileIsOK = false;
      } else {
        if (fileId === "modifiedFile") {
          this.modifiedFileIsOK = false;
        }
      }
    }
  }

  public submit(): void {
    this.clearErrorMessages();
    const gameName: string = (document.getElementById("gameName") as HTMLInputElement).value;
    if (this.modifiedFileIsOK && this.originalFileIsOK && this.fileValidator.isValidGameName(gameName)) {
      const file1: File = (document.getElementById("originalFile") as HTMLInputElement).files[0];
      const file2: File = (document.getElementById("modifiedFile") as HTMLInputElement).files[0];
      const newGame: ISimpleForm = { name: gameName, originalImage: file1, modifiedImage: file2 };
      this.gameService.createSimpleGame(newGame).subscribe((message: Message) => {
        if (message.title === ERROR_ID) {
          this.showErrorMessage("L'opération a été annulée: ");
          this.showErrorMessage(message.body);
        } else {
          this.close();
        }
      });
    } else {
      if (!this.fileValidator.isValidGameName(gameName)) {
        (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "red";
        this.showErrorMessage("Nom de jeu invalide.");
      } else {
        (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "black";
      }
      if (!this.modifiedFileIsOK) {
        (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "red";
        this.showErrorMessage("Fichier de jeu modifié invalide.");
      } else {
        (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "black";
      }
      if (!this.originalFileIsOK) {
        (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "red";
        this.showErrorMessage("Fichier de jeu original invalide.");
      } else {
        (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "black";
      }
    }
  }

  open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  close(): void {
    this.element.style.display = "none";
    document.body.classList.remove("modal-open");
  }

  private initModal(): void {
    const modal: SimpleGeneratorComponent = this;

    document.body.appendChild(this.element);

    this.element.addEventListener("click",  (event: Event) => {
      if (event.constructor.name === "modal") {
        modal.submit();
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
