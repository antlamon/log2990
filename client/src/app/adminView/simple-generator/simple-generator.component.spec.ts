import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { SimpleGeneratorComponent } from "./simple-generator.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "../free-generator/free-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalService } from "src/app/services/modal.service";
import { FileValidatorService } from "src/app/services/file-validator.service";
import { GameService } from "src/app/services/game.service";
import { By } from "@angular/platform-browser";
import { Game2DViewComponent } from "src/app/gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "src/app/gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "src/app/gameView/error-popup/error-popup.component";
import { GameMessagesComponent } from "src/app/gameView/game-messages/game-messages.component";
import { RenderService } from "src/app/scene3D/render.service";
import { GamecardComponent } from "../../gamecard/gamecard.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { WaitingComponent } from "src/app/waiting/waiting.component";
import { of } from "rxjs";
import { EndingMessageComponent } from "src/app/gameView/ending-message/ending-message.component";

describe("SimpleGeneratorComponent", () => {
  const LOADING_FILE_DELAY: number = 50;
  let component: SimpleGeneratorComponent;
  let fixture: ComponentFixture<SimpleGeneratorComponent>;

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
        GamecardComponent,
        ErrorPopupComponent,
        GameMessagesComponent,
        WaitingComponent,
        EndingMessageComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule, MatProgressSpinnerModule, HttpClientTestingModule],
      providers: [ModalService, FileValidatorService, GameService, RenderService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SimpleGeneratorComponent);
    component = fixture.componentInstance;
    component.id = "tempId";
    fixture.detectChanges();
    spyOn(component["gameService"], "createSimpleGame").and.returnValue(of({title: "GOOD", body: "message"}));

  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("file change event should arrive in handler", () => {
    const input: Element = fixture.debugElement.query(By.css("input[type=file]")).nativeElement;

    spyOn(component, "onFileChange");

    input.dispatchEvent(new Event("change"));

    expect(component.onFileChange).toHaveBeenCalled();
  });

  it("On file change with originalImage should return true", (done: DoneFn) => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "originalImage", {
      type: "image/bmp"
    });

    spyOn(component["fileValidator"], "dimensionsAreValid").and.returnValue(true);
    component.onFileChange(mockedFile, "originalFile");
    setTimeout(
      () => {
        expect(component["originalFileIsOK"]).toEqual(true);
        done();
      },
      LOADING_FILE_DELAY);
  });

  it("On file change with modifiedImage should return true", (done: DoneFn) => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "modifiedImage", {
      type: "image/bmp"
    });

    spyOn(component["fileValidator"], "dimensionsAreValid").and.returnValue(true);
    component.onFileChange(mockedFile, "modifiedFile");
    setTimeout(
      () => {
        expect(component["modifiedFileIsOK"]).toEqual(true);
        done();
      },
      LOADING_FILE_DELAY);
  });

  it("On file change with not bmp file should return false", () => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "originalImage");
    component.onFileChange(mockedFile, "originalFile");
    expect(component["originalFileIsOK"]).toEqual(false);
  });

  it("On file change with not bmp file should return false", () => {
    const mockedFile: File = new File(["data:image/bmp;base64,somedata"], "modifiedImage");
    component.onFileChange(mockedFile, "modifiedFile");
    expect(component["modifiedFileIsOK"]).toEqual(false);
  });
  describe("function submit should properly close the form when submitted", () => {
    it("should close the file and valid and the game name is valid", () => {
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "filesAreValid").and.returnValue(true);
      spyOn(component["fileValidator"], "isValidGameName").and.returnValue(true);
      const closeSpy: jasmine.Spy = spyOn(component, "close");
      component.submit();
      expect(closeSpy).toHaveBeenCalled();
    });
    it("should  NOT close the file and valid and the game name is NOT valid", () => {
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "filesAreValid").and.returnValue(false);
      spyOn(component["fileValidator"], "isValidGameName").and.returnValue(false);
      const closeSpy: jasmine.Spy = spyOn(component, "close");
      component.submit();
      expect(closeSpy).toHaveBeenCalledTimes(0);
    });
  });
  it("calling the close function should reset the form", () => {
    // tslint:disable-next-line:no-any
    const resetSpy: jasmine.Spy = spyOn<any>(component, "resetForm");
    component.close();
    expect(resetSpy).toHaveBeenCalled();
  });
  it("the function resetForm should properly reset the form's properties", () => {
    component["resetForm"]();
    expect(component["modifiedFileName"]).toEqual("Aucun fichier choisi.");
    expect(component["gameName"]).toEqual("");
    expect(component["errorsMessages"]).toEqual([]);
    expect(component["originalFileName"]).toEqual("Aucun fichier choisi.");
    expect(component["modifiedFileIsOK"]).toEqual(false);
    expect(component["originalFileIsOK"]).toEqual(false);
  });
});
