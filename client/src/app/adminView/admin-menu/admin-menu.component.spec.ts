import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { AdminMenuComponent } from "./admin-menu.component";
import { AppRoutingModule } from "src/app/app-routing.module";
import { AppComponent } from "src/app/app.component";
import { FreeGeneratorComponent } from "../free-generator/free-generator.component";
import { SimpleGeneratorComponent } from "../simple-generator/simple-generator.component";
import { InitialComponent } from "src/app/initial/initial.component";
import { ListViewComponent } from "src/app/list-view/list-view.component";
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from "@angular/common/http";
import { ModalService } from "../../services/modal.service";
import { Game2DViewComponent } from "src/app/gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "src/app/gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "src/app/gameView/error-popup/error-popup.component";
import { RenderService } from "src/app/scene3D/render.service";
import { GamecardComponent } from "../../gamecard/gamecard.component";
import { IndexService } from "src/app/services/index.service";
import { GameMessagesComponent } from "src/app/gameView/game-messages/game-messages.component";
import { MedievalObjectsCreatorService } from "src/app/scene3D/thematic/medieval-objects-creator.service";
import { ShapeCreatorService } from "src/app/scene3D/geometric/shape-creator.service";
import { SceneGeneratorService } from "src/app/scene3D/scene-generator.service";
describe("AdminMenuComponent", () => {
  let component: AdminMenuComponent;
  let fixture: ComponentFixture<AdminMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AdminMenuComponent,
        AppComponent,
        FreeGeneratorComponent,
        SimpleGeneratorComponent,
        InitialComponent,
        ListViewComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        GamecardComponent,
        GameMessagesComponent,
        ErrorPopupComponent
      ],
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule,
        MatProgressSpinnerModule
      ],
      providers: [ModalService, RenderService, IndexService, MedievalObjectsCreatorService, ShapeCreatorService, SceneGeneratorService]
    })
    .compileComponents().then(() => { }, (error: Error) => {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the modal ", () => {
    it("should call the simpleModal from the modalService", () => {
      const spySimple: jasmine.Spy = spyOn(component["modalService"], "open");
      component.openSimpleDialog("simpleModal");
      expect(spySimple).toHaveBeenCalledWith("simpleModal");
    });
    it("should call the freeeModal from the modalService", () => {
      const spyFree: jasmine.Spy = spyOn(component["modalService"], "open");
      component.openFreeDialog("freeeModal");
      expect(spyFree).toHaveBeenCalledWith("freeeModal");
    });
  });

});
