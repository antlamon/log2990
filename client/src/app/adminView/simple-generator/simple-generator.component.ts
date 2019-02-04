import { Component, ElementRef, OnInit, OnDestroy, Input } from "@angular/core";
import { GameService } from "src/app/game.service";
import {ISolo} from "../../../../../common/models/game";
import { ModalService } from "src/app/modal.service";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"],
})

export class SimpleGeneratorComponent implements OnInit, OnDestroy {

  private readonly FILE_FORMAT: string = "bmp";
  
  private readonly IMAGE_WIDTH: number   = 640;
  private readonly IMAGE_HEIGHT: number  = 480;
  private readonly MIN_LENGTH: number    = 3;
  private readonly MAX_LENGTH: number    = 15;
  private readonly WIDTH_OFFSET: number  = 18;
  private readonly HEIGHT_OFFSET: number = 22;

  private element: any;
  @Input() id: string;
  
  public constructor(private gameService: GameService,
    private modalService: ModalService, public el: ElementRef) {
      this.element = el.nativeElement;
    }

  public correctModifiedFile: boolean = false;
  public correctOriginalFile: boolean = false;



  public ngOnInit(): void {
    let modal = this;
    if(!this.id){
      console.error("modal must have an id");
      return;
    }
    
    document.body.appendChild(this.element);

    this.element.addEventListener("click", function(e: any) {
      if(e.target.className === "modal"){
        modal.submit();  
      }
    });

    this.modalService.add(this);
  }

  public ngOnDestroy(): void{
    this.modalService.remove(this.id);
    this.element.remove();

  }
  
  public onModifiedFileChange(event: any): void {
    let filenameModified: string = (document.getElementById("modifiedFile") as HTMLInputElement).value; 
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkModifiedExtension(filenameModified)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      
      reader.onload = () => {
        let buffer: ArrayBuffer= reader.result as ArrayBuffer;
        let bmpWidth = new DataView(buffer); 
        let bmpHeight = new DataView(buffer); 

        if(bmpWidth.getUint32(this.WIDTH_OFFSET,true) == this.IMAGE_WIDTH && bmpHeight.getUint32(this.HEIGHT_OFFSET,true) == this.IMAGE_HEIGHT){
          this.correctModifiedFile = true;
        }
      };
    }
    else { 
      this.correctModifiedFile = false; }
  }

  public onOriginalFileChange(event: any){
    let filenameOriginal: string = (document.getElementById("originalFile") as HTMLInputElement).value; 
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkOriginalExtension(filenameOriginal)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      
      reader.onload = () => {
        let buffer: ArrayBuffer = reader.result as ArrayBuffer;
        let bmpWidth = new DataView(buffer); 
        let bmpHeight = new DataView(buffer); 

        if(bmpWidth.getUint32(this.WIDTH_OFFSET,true) == this.IMAGE_WIDTH && bmpHeight.getUint32(this.HEIGHT_OFFSET,true) == this.IMAGE_HEIGHT){
          this.correctOriginalFile = true;
        }
      };
    }
    else{ this.correctOriginalFile = false; }
  }

  public submit(): void {
    this.clearErrorMessages();
    let gameName: string = (document.getElementById("gameName") as HTMLInputElement).value;
    
    if( !this.isValidGameName(gameName) ){
      console.log("Nom de jeu invalide");
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Nom de jeu invalide");
    } else {
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "black";
    }

    if( this.correctModifiedFile == false ){
      console.log("Fichier de jeu modifié invalide");
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Fichier de jeu modifié invalide");
    } else {
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "black";
    }
    
    if(this.correctOriginalFile == false){
      console.log("Fichier de jeu original invalide");
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "red";
      this.showErrorMessage("Fichier de jeu original invalide");
    } else {
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "black";
    }
    

    if(this.correctModifiedFile == true && this.correctOriginalFile == true && this.isValidGameName(gameName)){
      const file1: File = (document.getElementById("originalFile") as HTMLInputElement).files[0];
    const file2: File = (document.getElementById("modifiedFile") as HTMLInputElement).files[0];

    const newGame: ISolo = {name: gameName, originalImage: file1, modifiedImage: file2 };

    this.gameService.createSimpleGame(newGame);
      console.log("tentative de creer un jeu ... ");
      this.element.style.display = "none";
      document.body.classList.remove('modal-open');

    }      
  }

  public open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  public close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');

  }

  public checkBmpDimensions(width: number, height: number): boolean {
    return (width == this.IMAGE_WIDTH && height == this.IMAGE_HEIGHT);
  }

 
  public checkOriginalExtension(filename: string): boolean {
    let extensionOriginal = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    return (extensionOriginal == this.FILE_FORMAT);
  }

  public checkModifiedExtension(filename: string): boolean {
    let extensionModified = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    return (extensionModified == this.FILE_FORMAT);
  }

  public isValidGameName(name: string): boolean {
    return name.length < this.MAX_LENGTH && name.length > this.MIN_LENGTH && this.containOnlyAlphaNumeric(name);
  }

  public containOnlyAlphaNumeric(name: string): boolean {
    let check = name.match(/^[a-zA-Z0-9]+$/i);
    return check == null ? false : check[0].length == name.length;
  }

  public showErrorMessage(error: string): void{
    var errorBox = document.createElement("span");
    var errorMessage = document.createTextNode(error);
    errorBox.appendChild(errorMessage);
    document.getElementById("errorsMessages").appendChild(errorBox);
  }

  public clearErrorMessages(): void{
    var errors = document.getElementById("errorsMessages");
    while (errors.hasChildNodes()) {   
      errors.removeChild(errors.firstChild); 
    }      
  }

}


