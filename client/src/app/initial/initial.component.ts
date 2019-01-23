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

  public names:string[];

  username:string;

  constructor() {
    this.username="";//invalid name
    //Mock values for testing
    this.names=NAMES;
  }

  ngOnInit() {

  }
  public connect(username:string):void
  {
    if(!(this.isValidUsername(username))) {
      //Write error message
      return;
    }
    //To simulate a server database, must be changed
    if(this.names.includes(username)) {
      //Write error message
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

}
