import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";

@Component({
  selector: "app-simple-generator",
  templateUrl: "./simple-generator.component.html",
  styleUrls: ["./simple-generator.component.css"]
})

export class SimpleGeneratorComponent implements OnInit {

  private readonly FILE_FORMAT: string = "bmp";
  private readonly IMAGE_WIDTH: number = 640;
  private readonly IMAGE_HEIGHT: number = 480;
  private readonly MIN_LENGTH: number = 3;
  private readonly MAX_LENGTH: number = 15;
  private readonly WIDTH_OFFSET: number = 18;
	private readonly HEIGHT_OFFSET: number = 22;

  public correctModifiedFile: boolean = false;
  public correctOriginalFile: boolean = false;

  public constructor(private router: Router) {

  }

  public ngOnInit(): void {

  }

  public onModifiedFileChange(event: any): void {
    const filenameModified: string = (document.getElementById("modifiedFile") as HTMLInputElement).value;
    const reader: FileReader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkModifiedExtension(filenameModified)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const buffer: ArrayBuffer = reader.result as ArrayBuffer;
        const bmpData: DataView = new DataView(buffer);
        const bmpHeight: number = bmpData.getUint32(this.HEIGHT_OFFSET, true);
        const bmpWidth: number = bmpData.getUint32(this.WIDTH_OFFSET, true);

        if(this.checkBmpDimensions(bmpWidth, bmpHeight)){
          this.correctModifiedFile = true;
        }
      };
    } else { 
      this.correctModifiedFile = false;
    }
  }

  public onOriginalFileChange(event: any){
    const filenameOriginal: string = (document.getElementById("originalFile") as HTMLInputElement).value;
    const reader: FileReader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkOriginalExtension(filenameOriginal)) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);

      reader.onload = () => {
        const buffer: ArrayBuffer = reader.result as ArrayBuffer;
        const bmpData: DataView = new DataView(buffer);
        const bmpHeight: number = bmpData.getUint32(this.HEIGHT_OFFSET, true);
        const bmpWidth: number = bmpData.getUint32(this.WIDTH_OFFSET, true);

        if(this.checkBmpDimensions(bmpWidth, bmpHeight)){
          this.correctOriginalFile = true;
        }
      };
    } else {
      this.correctOriginalFile = false;
    }
  }

  public submit(): void {
    let gameName: string = (document.getElementById("gameName") as HTMLInputElement).value;

    if( !this.isValidGameName(gameName) ){
      console.log("Nom de jeu invalide");
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "red";
    } else {
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "black";
    }

    if( this.correctModifiedFile == false ){
      console.log("Fichier de jeu modifié invalide");
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "red";
    } else {
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "black";
    }

    if(this.correctOriginalFile == false){
      console.log("Fichier de jeu original invalide");
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "red"; 
    } else {
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "black";
    }

    if(this.correctModifiedFile == true && this.correctOriginalFile == true && this.isValidGameName(gameName)){
      this.router.navigate(['admin']);
      console.log("Jeu créé");
    }
  }

  public close(): void {
    this.router.navigate(['admin']); // go back to admin home
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

}


