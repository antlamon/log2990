import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-initial',
  templateUrl: './initial.component.html',
  styleUrls: ['./initial.component.css']
})
export class InitialComponent implements OnInit {

  readonly MIN_LENGTH:number =3;
  readonly MAX_LENGTH:number =10;

  username:String;

  constructor() {
    this.username="";//nom invalide
  }

  ngOnInit() {
  }
  public connect(username:String)
  {
    console.log(username);
  }
   public isValidUsername(nom:String):boolean
  {
    return nom.length<this.MAX_LENGTH && nom.length>this.MIN_LENGTH && this.containOnlyAlphaNumeric(nom);
  }
  public containOnlyAlphaNumeric(nom:String) {
    let check= nom.match(/^[a-z0-9A-Z]+$/i);
    console.log(check);
    return check==null?false:check[0].length==nom.length
  }

}
