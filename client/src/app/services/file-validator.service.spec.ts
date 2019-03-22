import { async, TestBed } from "@angular/core/testing";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalService } from "src/app/services/modal.service";
import { FileValidatorService } from "./file-validator.service";
import { Game2DViewComponent } from "../gameView/game2D-view/game2D-view.component";
import { NO_MIN_OBJECTS, NO_MAX_OBJECTS } from "../../../../common/models/game3D";
import { Game3DViewComponent } from "../gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "../gameView/error-popup/error-popup.component";
import { RenderService } from "../scene3D/scene3-d/render.service";
describe("FileValidatorService", () => {

  const LARGER_WIDTH: number = 1000;
  const LARGER_HEIGHT: number = 1000;
  const SMALLER_WIDTH: number = 200;
  const SMALLER_HEIGHT: number = 200;
  const NULL_HEIGHT: number = null;
  const NULL_WIDTH: number = 0;
  const CORRECT_WIDTH: number = 640;
  const CORRECT_HEIGHT: number = 480;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        SimpleGeneratorComponent,
        AdminMenuComponent,
        FreeGeneratorComponent,
        InitialComponent,
        ListViewComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        ErrorPopupComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule, MatProgressSpinnerModule],
      providers: [ModalService, FileValidatorService, Game2DViewComponent, RenderService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  const service: FileValidatorService = new FileValidatorService();

  it("should be created",() => {
    expect(service).toBeTruthy();
  });

  describe("Test for the function checkBmpDimensions", () => {
    it("A bmp that is smaller than 640x480 should return false", () => {
      expect(service.dimensionsAreValid(SMALLER_WIDTH, SMALLER_HEIGHT)).toEqual(false);
    });
    it("A .bmp that is larger than 640x480 should return false", () => {
      expect(service.dimensionsAreValid(LARGER_WIDTH, LARGER_HEIGHT)).toEqual(false);
    });
    it("A .bmp wih null dimensions should return false", () => {
      expect(service.dimensionsAreValid(NULL_WIDTH, NULL_HEIGHT)).toEqual(false);
    });
    it("A .bmp wih 640x480 dimensions should return true", () => {
      expect(service.dimensionsAreValid(CORRECT_WIDTH, CORRECT_HEIGHT)).toEqual(true);
    });
  });

  describe("Test for the function onlyNumeric", () => {
    it("No letters should pass", () => {
      expect(service.containOnlyNumeric("ALLO")).toEqual(false);
    });
    it("no special caracter should pass", () => {
      expect(service.containOnlyNumeric("!1243")).toEqual(false);
    });
    it("no special caracter should pass", () => {
      expect(service.containOnlyNumeric("!12%?")).toEqual(false);
    });
    it("only numbers should pass", () => {
      expect(service.containOnlyNumeric("123")).toEqual(true);
    });
    it("@#$!@ should not pass", () => {
      expect(service.containOnlyNumeric("@#$!@ ")).toEqual(false);
    });
  });

  describe("Test for the function validating object Qty", () => {
    it("No number below the constant NO_OBJ_MIN", () => {
      const delta: number = 10;
      const veryBelowMin: number = NO_MIN_OBJECTS - delta;

      expect(service.isValidObjNb(veryBelowMin.toString())).toEqual(false);
    });
    it("No number below the constant NO_OBJ_MIN", () => {
      const belowMin: number = NO_MIN_OBJECTS - 1;
      expect(service.isValidObjNb(belowMin.toString())).toEqual(false);
    });
    it("should accept number equal to the constant NO_OBJ_MIN", () => {
      const min: number = NO_MIN_OBJECTS;
      expect(service.isValidObjNb(min.toString())).toEqual(true);
    });
    it("No number aboce NO_OBJ_MAX should be accepted", () => {
      const tooMuch: number = NO_MAX_OBJECTS + 1;
      expect(service.isValidObjNb(tooMuch.toString())).toEqual(false);
    });
    it("should accept number equal to the constant NO_OBJ_MAX", () => {
      const max: number = NO_MAX_OBJECTS;
      expect(service.isValidObjNb(max.toString())).toEqual(true);
    });
  });

  describe("Test for the name of the game", () => {
    it("A name longer than 15 characters should return false", () => {
      expect(service.isValidGameName("abcdefghijklmnopqrstuvwxyz")).toEqual(false);
    });
    it("A name shorter than 3 characters should return false", () => {
      expect(service.isValidGameName("az")).toEqual(false);
    });
    it("A name that contains between 3 and 15 characters should return true", () => {
      expect(service.isValidGameName("nomdujeu")).toEqual(true);
    });
    it("A name that does not only contains alphanumeric characters should return false", () => {
      expect(service.containOnlyAlphaNumeric("@#$ans")).toEqual(false);
    });
    it("A name that only contains alphanumeric characters should return true", () => {
      expect(service.containOnlyAlphaNumeric("dksjhfad24324")).toEqual(true);
    });
    it("A NULL name should return false", () => {
      expect(service.isValidGameName("")).toEqual(false);
    });
  });
  describe("Test for the username validation", () => {
    it("A username longer than 10 characters should return false", () => {
      expect(service.isValidName("abcdefghijklmnopqrstuvwxyz")).toEqual(false);
    });
    it("A username shorter than 3 characters should return false", () => {
      expect(service.isValidName("az")).toEqual(false);
    });
    it("A username that contains between 3 and 15 characters should return true", () => {
      expect(service.isValidName("nomdujeu")).toEqual(true);
    });
    it("A NULL username should return false", () => {
      expect(service.isValidName("")).toEqual(false);
    });
  });
});
