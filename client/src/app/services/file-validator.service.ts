import { Injectable } from "@angular/core";
import { NO_MAX_OBJECTS, NO_MIN_OBJECTS } from "../../../../common/models/game3D";

@Injectable({
  providedIn: "root"
})
export class FileValidatorService {

  private readonly IMAGE_WIDTH: number = 640;
  private readonly IMAGE_HEIGHT: number = 480;
  public readonly MIN_LENGTH: number = 3;
  private readonly MAX_LENGTH: number = 15;
  public readonly MAX_NAME: number = 10;
  private readonly ALPHA_NUMERICS_REGEX: RegExp = /^[a-zA-Z0-9]+$/i;
  private readonly NUMERICS_REGEX: RegExp = /^[0-9]+$/i;

  public dimensionsAreValid(bmpWidth: number, bmpHeight: number): boolean {
    return (bmpWidth === this.IMAGE_WIDTH && bmpHeight === this.IMAGE_HEIGHT);
  }

  public isValidGameName(name: string): boolean {
    return name.length <= this.MAX_LENGTH && name.length >= this.MIN_LENGTH && this.containOnlyAlphaNumeric(name);
  }
  public isValidNameLength(name: string): boolean {
    return name.length <= this.MAX_NAME && name.length >= this.MIN_LENGTH;
  }

  public isValidName(name: string): boolean {
    return this.isValidNameLength(name) && this.containOnlyAlphaNumeric(name);
  }

  public containOnlyAlphaNumeric(name: string): boolean {
    const check: RegExpMatchArray = name.match(this.ALPHA_NUMERICS_REGEX);

    return check === null ? false : check[0].length === name.length;
  }
  public containOnlyNumeric(nbObj: string): boolean {
    const check: RegExpMatchArray = nbObj.match(this.NUMERICS_REGEX);

    return check === null ? false : check[0].length === nbObj.length;
  }
  public isValidObjNb(nbObj: string): boolean {
    const nb: number = +nbObj;

    return this.containOnlyNumeric(nbObj) && nb <= NO_MAX_OBJECTS && nb >= NO_MIN_OBJECTS;
  }
}
