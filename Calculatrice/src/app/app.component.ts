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
    let array = text.split(',');
    return array.reduce(function(a, b) {return a + parseInt(b)}, 0);
  }

  add1(): void{
    this.result = this.add(this.value);
  }
}
