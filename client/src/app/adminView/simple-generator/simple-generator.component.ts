import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-simple-generator',
  templateUrl: './simple-generator.component.html',
  styleUrls: ['./simple-generator.component.css']
})
export class SimpleGeneratorComponent implements OnInit {


  constructor(private router: Router, private fb: FormBuilder) { 
  }

  ngOnInit() {
  }

  onFileChange(event) {
    const reader = new FileReader();

    if(event.target.files && event.target.files.length && this.checkExtension()) {
      const [file] = event.target.files;
      reader.readAsArrayBuffer(file);
      document.getElementById("submitButton").disabled = false;
      
      reader.onload = () => {
        let buffer = reader.result;
        let bmpWidth = new DataView(buffer); 
        let bmpHeight = new DataView(buffer); 
        let width = bmpWidth.getUint32(18,true);
        let height = bmpHeight.getUint32(22,true);
      };
    }
    else{ document.getElementById("submitButton").disabled = true; }
  }

  submit() {
    //submit form ... TODO
    this.router.navigate(['admin']); // go back to admin home
  }

  close() {
    this.router.navigate(['admin']); // go back to admin home
  }
 
  checkExtension(): boolean {
   
    let filename = document.getElementById("fileOrigin").value; 
    let extension = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);

    return (extension == "bmp")
  }

}


