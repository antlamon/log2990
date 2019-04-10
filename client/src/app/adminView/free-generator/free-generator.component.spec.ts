import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AppRoutingModule } from "src/app/app-routing.module";
import { FreeGeneratorComponent } from "./free-generator.component";
import { AdminMenuComponent } from "../admin-menu/admin-menu.component";
import { SimpleGeneratorComponent } from "../simple-generator/simple-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
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
import { EndingMessageComponent } from "src/app/gameView/ending-message/ending-message.component";

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
        EndingMessageComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule, MatProgressSpinnerModule, HttpClientTestingModule],
      providers: [ModalService, RenderService]
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the function hasModification", () => {
    it("hasModifications should return false if no modification selected", () => {
      expect(component.hasModifications()).toEqual(false);
    });
    it("hasModifications should return true if deletecheckBox is checked", () => {
      component["deleteCheckbox"] = true;
      expect(component.hasModifications()).toEqual(true);
    });
    it("hasModifications should return true if addcheckBox is checked", () => {
      component["addCheckbox"] = true;
      expect(component.hasModifications()).toEqual(true);
    });
    it("hasModifications should return true if colorcheckBox is checked", () => {
      component["colorCheckbox"] = true;
      expect(component.hasModifications()).toEqual(true);
    });
  });
  describe("Test for the function changetype", () => {
    it("changetype should modify the selectedtype", () => {
      component.changeType("newType");
      expect(component["selectedType"]).toEqual("newType");
    });
  });

});
