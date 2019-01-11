import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Calculatrice';
  value = "";
  result = 0;

  add(text: string): number{
    if(text.length == 0) return 0;
    let array;
    if(text.slice(0, 2) === "//"){
      let separator = text[2];
      array = text.slice(3, text.length).split("\n").join(separator).split(separator).filter(function(el) { return el != "" ;});
    }
    else{
      array = text.split("\n").join(',').split(',');
    }
    return array.reduce(function(a, b) {return a + parseInt(b)}, 0);
  }

  add1(): void{
    this.result = this.add(this.value);
  }
}
