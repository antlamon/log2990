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
    return 0;
  }

  add1(): void{
    this.result = this.add(this.value);
  }
}
