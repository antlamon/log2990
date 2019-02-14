import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class FileValidatorService {

  private readonly IMAGE_WIDTH: number = 640;
  private readonly IMAGE_HEIGHT: number = 480;
  private readonly MIN_LENGTH: number = 3;
  private readonly MAX_LENGTH: number = 15;
  private readonly MIN_OBJ: number = 50;
  private readonly MAX_OBJ: number = 200;

  public constructor() { }

  public dimensionsAreValid(bmpWidth: number, bmpHeight: number): boolean {
    return (bmpWidth === this.IMAGE_WIDTH && bmpHeight === this.IMAGE_HEIGHT);
  }

  public isValidGameName(name: string): boolean {
    return name.length < this.MAX_LENGTH && name.length > this.MIN_LENGTH && this.containOnlyAlphaNumeric(name);
  }

  public containOnlyAlphaNumeric(name: string): boolean {
    const check: RegExpMatchArray = name.match(/^[a-zA-Z0-9]+$/i);

    return check === null ? false : check[0].length === name.length;
  }
  public containOnlyNumeric(nbObj: string): boolean {
    const check: RegExpMatchArray = nbObj.match(/^[0-9]+$/i);

    return check === null ? false : check[0].length === nbObj.length;
  }
  public isValidObjNb(nbObj: string): boolean {
    const nb: number = +nbObj;
    return this.containOnlyNumeric(nbObj) && nb <= this.MAX_OBJ && nb >= this.MIN_OBJ;
  }
}
