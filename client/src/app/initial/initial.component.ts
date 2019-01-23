import {Component, OnInit} from '@angular/core';
import{NAMES} from '../mock-names'

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  readonly MIN_LENGTH:number =3;
  readonly MAX_LENGTH:number =10;

  readonly  ERROR_ID:string='error';
  readonly  ERROR_MESSAGE_INVALID_NAME= 'The name entered was invalid';
  readonly  ERROR_MESSAGE_ALREADY_USED_NAME='The name is already being used';

  public names:string[];

  username:string;

  constructor() {
    this.username='';//invalid name
    //Mock values for testing
    this.names=NAMES;
  }

  ngOnInit() {

  }
  public connect(username:string):void
  {
    if(!(this.isValidUsername(username))) {
      this.showErrorMessage(this.ERROR_MESSAGE_INVALID_NAME);
      return;
    }
    //To simulate a server database, must be changed
    if(this.names.includes(username)) {
      this.showErrorMessage(this.ERROR_MESSAGE_ALREADY_USED_NAME);
      return;
    }
    //Change view
    this.names.push(username);
  }
   public isValidUsername(nom:string):boolean
  {
    return nom.length<this.MAX_LENGTH && nom.length>this.MIN_LENGTH && this.containOnlyAlphaNumeric(nom);
  }
  public containOnlyAlphaNumeric(nom:string):boolean {
    let check= nom.match(/^[a-zA-Z0-9]+$/i);
    return check==null ? false : check[0].length==nom.length
  }

  showErrorMessage(message:string):void
  {
    let errorBox:HTMLElement = <HTMLElement>document.getElementById(this.ERROR_ID);

    errorBox.textContent=message;
    errorBox.style.opacity='1';
  }

}
