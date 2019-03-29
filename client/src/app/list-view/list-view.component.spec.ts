import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { Game2DViewComponent } from "../gameView/game2D-view/game2D-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";
import { Game3DViewComponent } from "../gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "../gameView/error-popup/error-popup.component";
import { RenderService } from "../scene3D/render.service";
import { GamecardComponent } from "../gamecard/gamecard.component";
import { IndexService } from "../services/index.service";
import { MedievalObjectsCreatorService } from "../scene3D/thematic/medieval-objects-creator.service";
import { ShapeCreatorService } from "../scene3D/geometric/shape-creator.service";
import { SceneGeneratorService } from "../scene3D/scene-generator.service";
import { GameMessagesComponent } from "../gameView/game-messages/game-messages.component";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { GameManagerService } from "../services/game-manager.service";
import { IGame3D } from "../../../../common/models/game3D";

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "",
    originalScene: [],
    solo: [],
    multi: [],
    differences: [],
    isThematic: false,
    backColor: 0,
  };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        MatProgressSpinnerModule,
        HttpClientTestingModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        Game3DViewComponent,
        ErrorPopupComponent,
        GamecardComponent,
        GameMessagesComponent
      ],
      providers: [GameManagerService,
                  RenderService,
                  IndexService,
                  MedievalObjectsCreatorService,
                  ShapeCreatorService,
                  SceneGeneratorService],
    })
      .compileComponents().then(() => { }, (error: Error) => { });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("The function getImageUrl should call the game manager", () => {
    const spy: jasmine.Spy = spyOn(component["gameManager"], "getImageUrl").and.callThrough();
    component.getImageUrl(mockGame3D);
    expect(spy).toHaveBeenCalled();
  });
});
