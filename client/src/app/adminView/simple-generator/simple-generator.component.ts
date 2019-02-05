import { Component, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";
import { GameService } from "src/app/services/game.service";
import {ISimpleForm} from "../../../../../common/models/game";
import { ModalService } from "src/app/services/modal.service";
import { IModal } from "src/app/models/modal";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"],
})

export class SimpleGeneratorComponent implements OnInit, OnDestroy, IModal {

  private readonly FILE_FORMAT: string = "bmp";
  private readonly IMAGE_WIDTH: number = 640;
  private readonly IMAGE_HEIGHT: number = 480;
  private readonly MIN_LENGTH: number = 3;
  private readonly MAX_LENGTH: number = 15;
  private readonly WIDTH_OFFSET: number = 18;
  private readonly HEIGHT_OFFSET: number = 22;

  private modifiedFileIsOK: boolean = false;
  private originalFileIsOK: boolean = false;

  private element: any;
  @Input() id: string;

  public constructor(private gameService: GameService, private modalService: ModalService, public el: ElementRef) {
    this.element = el.nativeElement;
  }

  public ngOnInit(): void {
    this.initModal();
  }

  public ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();

  }

  public onFileChange(event: any, fileId: string): void {
    let fileName: string = (document.getElementById(fileId) as HTMLInputElement).value;
    const reader = new FileReader();

    if (event.target.files && event.target.files.length && this.fileExtensionIsOK(fileName)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        let buffer: ArrayBuffer = reader.result as ArrayBuffer;
        let bmpWidth = new DataView(buffer);
        let bmpHeight = new DataView(buffer);

        if (this.dimensionsAreValid(bmpWidth,bmpHeight)) {
          if (fileId == "originalFile") {
            this.originalFileIsOK = true;
          } else {
            if (fileId == "modifiedFile") {
              this.modifiedFileIsOK = true;
            }
          }
        }
      };
    } else {
      if (fileId == "originalFile") {
        this.originalFileIsOK = false;
      } else {
        if (fileId == "modifiedFile") {
          this.modifiedFileIsOK = false;
        }
      }
    }
  }

  private submit(): void {
    this.clearErrorMessages();
    let gameName: string = (document.getElementById("gameName") as HTMLInputElement).value;

    if (!this.isValidGameName(gameName)) {
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Nom de jeu invalide");
    } 

    if (!this.modifiedFileIsOK) {
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Fichier de jeu modifié invalide");
    } 

    if (!this.originalFileIsOK) {
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Fichier de jeu original invalide");
    } 


    if (this.modifiedFileIsOK && this.originalFileIsOK && this.isValidGameName(gameName)) {
      const file1: File = (document.getElementById("originalFile") as HTMLInputElement).files[0];
      const file2: File = (document.getElementById("modifiedFile") as HTMLInputElement).files[0];

      const newGame: ISimpleForm = { name: gameName, originalImage: file1, modifiedImage: file2 };

      this.gameService.createSimpleGame(newGame);
      
      this.close();

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

  private initModal() {
    let modal = this;

    document.body.appendChild(this.element);

    this.element.addEventListener("click", function (event: any) {
      if (event.target.className === "modal") {
        modal.submit();
      }
    });

    this.modalService.add(this);

  }

  private dimensionsAreValid(bmpWidth: DataView, bmpHeight: DataView): boolean {
    return (bmpWidth.getUint32(this.WIDTH_OFFSET, true) == this.IMAGE_WIDTH && bmpHeight.getUint32(this.HEIGHT_OFFSET, true) == this.IMAGE_HEIGHT);
  }


  public fileExtensionIsOK(fileName: string): boolean {
    const extension: string = fileName.slice((fileName.lastIndexOf(".") - 1 >>> 0) + 2);
    return (extension === this.FILE_FORMAT);
  }

  private isValidGameName(name: string): boolean {
    return name.length < this.MAX_LENGTH && name.length > this.MIN_LENGTH && this.containOnlyAlphaNumeric(name);
  }

  private containOnlyAlphaNumeric(name: string): boolean {
    let check = name.match(/^[a-zA-Z0-9]+$/i);
    return check == null ? false : check[0].length == name.length;
  }

  private showErrorMessage(error: string): void {
    var errorBox = document.createElement("span");
    var errorMessage = document.createTextNode(error);
    errorBox.appendChild(errorMessage);
    document.getElementById("errorsMessages").appendChild(errorBox);
  }

  private clearErrorMessages(): void {
    let errors = document.getElementById("errorsMessages");
    while (errors.hasChildNodes()) {
      errors.removeChild(errors.firstChild);
    }
  }
}
