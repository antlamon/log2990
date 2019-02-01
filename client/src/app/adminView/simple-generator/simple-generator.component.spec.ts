import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleGeneratorComponent } from "./simple-generator.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "../free-generator/free-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
 
describe("SimpleGeneratorComponent", () => {
  let component: SimpleGeneratorComponent;
  let fixture: ComponentFixture<SimpleGeneratorComponent>;
  const LARGER_WIDTH: number = 1000;
  const LARGER_HEIGHT: number = 1000;
  const SMALLER_WIDTH: number = 200;
  const SMALLER_HEIGHT: number = 200;
  const NULL_HEIGHT: number = 0;
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
        ListViewComponent
      ],
      imports: [ AppRoutingModule, FormsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the functions checkModifiedExtention and checkOriginalExtension", () => {
    it("A .jpeg should return false", () => {
      expect(component.checkModifiedExtension("testFile.jpeg") && component.checkOriginalExtension("testFile.jpeg")).toEqual(false);
    });
    it("A .bmp should return true", () => {
      expect(component.checkModifiedExtension("testFile.bmp") && component.checkOriginalExtension("testFile.bmp")).toEqual(true);
    });
    it("An empty value should return false", () => {
      expect(component.checkModifiedExtension("") && component.checkOriginalExtension("")).toEqual(false);
    });
  });

  describe("Test for the function checkBmpDimensions", () => {
    it("A bmp that is smaller than 640x480 should return false", () => {
      expect(component.checkBmpDimensions(SMALLER_WIDTH, SMALLER_HEIGHT)).toEqual(false);
    });
    it("A .bmp that is larger than 640x480 should return false", () => {
      expect(component.checkBmpDimensions(LARGER_WIDTH, LARGER_HEIGHT)).toEqual(false);
    });
    it("A .bmp wih null dimensions should return false", () => {
      expect(component.checkBmpDimensions(NULL_WIDTH, NULL_HEIGHT)).toEqual(false);
    });
    it("A .bmp wih 640x480 dimensions should return true", () => {
      expect(component.checkBmpDimensions(CORRECT_WIDTH, CORRECT_HEIGHT)).toEqual(true);
    });
  });

  describe("Test for the name of the game", () => {
    it("A name longer than 15 characters should return false", () => {
      expect(component.isValidGameName("abcdefghijklmnopqrstuvwxyz")).toEqual(false);
    });
    it("A name shorter than 3 characters should return false", () => {
      expect(component.isValidGameName("az")).toEqual(false);
    });
    it("A name that contains between 3 and 15 characters should return true", () => {
      expect(component.isValidGameName("nomdujeu")).toEqual(true);
    });
    it("A name that does not only contains alphanumeric characters should return false", () => {
      expect(component.containOnlyAlphaNumeric("@#$ans")).toEqual(false);
    });
    it("A name that only contains alphanumeric characters should return true", () => {
      expect(component.containOnlyAlphaNumeric("dksjhfalkdsjfhaskd24324")).toEqual(true);
    });
    it("A NULL name should return false", () => {
      expect(component.isValidGameName("")).toEqual(false);
    });
  });

});
