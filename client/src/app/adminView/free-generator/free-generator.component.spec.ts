import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FreeGeneratorComponent } from "./free-generator.component";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { SimpleGeneratorComponent } from "../simple-generator/simple-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule} from "@angular/common/http";
import { ModalService } from "src/app/services/modal.service";
import { Game2DViewComponent } from "src/app/gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "src/app/gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "src/app/gameView/error-popup/error-popup.component";
import { GameMessagesComponent } from "src/app/gameView/game-messages/game-messages.component";
import { RenderService } from "src/app/scene3D/render.service";
import { GamecardComponent } from "../../gamecard/gamecard.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { WaitingComponent } from "src/app/waiting/waiting.component";
import { GameService } from "src/app/services/game.service";
import { of } from "rxjs";

describe("FreeGeneratorComponent", () => {
  let component: FreeGeneratorComponent;
  let fixture: ComponentFixture<FreeGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FreeGeneratorComponent,
        AdminMenuComponent,
        SimpleGeneratorComponent,
        InitialComponent,
        ListViewComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        ErrorPopupComponent,
        GameMessagesComponent,
        GamecardComponent,
        WaitingComponent,
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule, MatProgressSpinnerModule, HttpClientTestingModule],
      providers: [ModalService, RenderService, GameService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component["gameService"], "createFreeGame").and.returnValue(of({title: "GOOD", body: "message"}));
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the function hasModification", () => {
    it("hasModifications should return false if no modification selected", () => {
      const hasModif: boolean = component["hasModifications"]();
      expect(hasModif).toEqual(false);
    });
    it("hasModifications should return true if deletecheckBox is checked", () => {
      component["deleteCheckbox"] = true;
      const hasModif: boolean = component["hasModifications"]();
      expect(hasModif).toEqual(true);
    });
    it("hasModifications should return true if addcheckBox is checked", () => {
      component["addCheckbox"] = true;
      const hasModif: boolean = component["hasModifications"]();
      expect(hasModif).toEqual(true);
    });
    it("hasModifications should return true if colorcheckBox is checked", () => {
      component["colorCheckbox"] = true;
      const hasModif: boolean = component["hasModifications"]();
      expect(hasModif).toEqual(true);
    });
  });
  describe("Test for the function changetype", () => {
    it("changetype should modify the selectedtype", () => {
      component.changeType("newType");
      expect(component["selectedType"]).toEqual("newType");
    });
  });
  describe("function submit should properly close the form when submitted", () => {
    it("should close the form the form is valid", () => {
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "isValidSubmit").and.returnValue(true);
      const closeSpy: jasmine.Spy = spyOn(component, "close");
      component.submit();
      expect(closeSpy).toHaveBeenCalled();
    });
    it("should NOT close the form if the form is NOT valid", () => {
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "isValidSubmit").and.returnValue(false);
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

});
