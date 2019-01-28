import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-simple-generator',
  templateUrl: './simple-generator.component.html',
  styleUrls: ['./simple-generator.component.css']
})
export class SimpleGeneratorComponent implements OnInit {

  readonly FILE_FORMAT: string = "bmp";
  readonly IMAGE_WIDTH: number = 640;
  readonly IMAGE_HEIGHT: number = 480; 
  readonly MIN_LENGTH:number = 3;
  readonly MAX_LENGTH:number = 10;
  readonly WIDTH_OFFSET: number = 18; 
	readonly HEIGHT_OFFSET: number = 22;

  public correctModifiedFile: boolean = false;
  public correctOriginalFile: boolean = false;

  constructor(private router: Router) { 
    
  }

  public ngOnInit(): void {

  }

  public onModifiedFileChange(event: any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkModifiedExtension()) {
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
    else{ this.correctModifiedFile = false; }
  }

  public onOriginalFileChange(event: any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkOriginalExtension()) {
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

  public submit() {
    let gameName = (document.getElementById("gameName") as HTMLInputElement).value;

    if(!this.isValidGameName(gameName)){
      console.log("Nom de jeu invalide");
      (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "red"; 
    }else{ (document.getElementById("gameNameLabel") as HTMLParagraphElement).style.color = "black"; }

    if(this.correctModifiedFile == false){
      console.log("Fichier de jeu modifié invalide");
      (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "red"; 
    }else{ (document.getElementById("modifiedFileLabel") as HTMLParagraphElement).style.color = "black"; }

    if(this.correctOriginalFile == false){
      console.log("Fichier de jeu original invalide");
      (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "red"; 
    }else{ (document.getElementById("originalFileLabel") as HTMLParagraphElement).style.color = "black"; }

    if(this.correctModifiedFile == true && this.correctOriginalFile == true && this.isValidGameName(gameName)){
      // this.router.navigate(['admin']); // go back to admin home
      console.log("Jeu créé")
    }
  }

  public close() {
    this.router.navigate(['admin']); // go back to admin home
  }
 
  public checkOriginalExtension(){
   
    let filenameOriginal = (document.getElementById("originalFile") as HTMLInputElement).value; 
    let extensionOriginal = filenameOriginal.slice((filenameOriginal.lastIndexOf(".") - 1 >>> 0) + 2);

    return (extensionOriginal == this.FILE_FORMAT);

  }

  public checkModifiedExtension(){
    let filenameModified = (document.getElementById("modifiedFile") as HTMLInputElement).value; 
    let extensionModified = filenameModified.slice((filenameModified.lastIndexOf(".") - 1 >>> 0) + 2);

    return (extensionModified == this.FILE_FORMAT);
  }

  public isValidGameName(nom:string):boolean
  {
    return nom.length<this.MAX_LENGTH && nom.length>this.MIN_LENGTH && this.containOnlyAlphaNumeric(nom);
  }
  public containOnlyAlphaNumeric(nom:string):boolean {
    let check= nom.match(/^[a-zA-Z0-9]+$/i);
    return check==null ? false : check[0].length==nom.length
  }


}


