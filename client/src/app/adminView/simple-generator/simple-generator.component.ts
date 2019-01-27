import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';

const FILE_FORMAT = "bmp";
const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 480; 

let correctModifiedFile = false;
let correctOriginalFile = false;


@Component({
  selector: 'app-simple-generator',
  templateUrl: './simple-generator.component.html',
  styleUrls: ['./simple-generator.component.css']
})
export class SimpleGeneratorComponent implements OnInit {


  constructor(private router: Router) { 
    
  }

  public ngOnInit(): void {
    while(correctModifiedFile == true && correctOriginalFile == true){
      if (document.getElementById("submitButton")) {
        const boutonSub: HTMLButtonElement | null= document.getElementById("submitButton") as HTMLButtonElement;
        boutonSub.disabled = false;
      }
    }
  }

  public onFileChange(event: any): void {
    
  }

  onModifiedFileChange(event: any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkModifiedExtension()) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      
      reader.onload = () => {
        let buffer: ArrayBuffer= reader.result as ArrayBuffer;
        let bmpWidth = new DataView(buffer); 
        let bmpHeight = new DataView(buffer); 

        if(bmpWidth.getUint32(18,true) == IMAGE_WIDTH && bmpHeight.getUint32(22,true) == IMAGE_HEIGHT){
          correctModifiedFile = true;
        }
      };
    }
    else{ correctModifiedFile = false; }
  }

  onOriginalFileChange(event: any){
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkOriginalExtension()) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      
      reader.onload = () => {
        let buffer: ArrayBuffer = reader.result as ArrayBuffer;
        let bmpWidth = new DataView(buffer); 
        let bmpHeight = new DataView(buffer); 

        if(bmpWidth.getUint32(18,true) == IMAGE_WIDTH && bmpHeight.getUint32(22,true) == IMAGE_HEIGHT){
          correctOriginalFile = true;
        }
      };
    }
    else{ correctOriginalFile = false; }
  }

  submit() {
    //submit form ... TODO
    this.router.navigate(['admin']); // go back to admin home
  }

  close() {
    this.router.navigate(['admin']); // go back to admin home
  }
 
  checkOriginalExtension(){
   
    let filenameOriginal = (document.getElementById("originalFile") as HTMLInputElement).value; 
    let extensionOriginal = filenameOriginal.slice((filenameOriginal.lastIndexOf(".") - 1 >>> 0) + 2);

    return (extensionOriginal == FILE_FORMAT);

  }

  checkModifiedExtension(){
    let filenameModified = (document.getElementById("modifiedFile") as HTMLInputElement).value; 
    let extensionModified = filenameModified.slice((filenameModified.lastIndexOf(".") - 1 >>> 0) + 2);

    return (extensionModified == FILE_FORMAT);
  }
}


