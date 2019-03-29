// tslint:disable:no-any les attributs sont des types any
// tslint:disable:no-floating-promises pour le before each
import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { AppComponent } from "./app.component";
import { IndexService } from "./services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { InitialComponent } from "./initial/initial.component";
import {FormsModule} from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AdminMenuComponent } from "./adminView/admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "./adminView/free-generator/free-generator.component";
import { SimpleGeneratorComponent } from "./adminView/simple-generator/simple-generator.component";
import { ListViewComponent } from "./list-view/list-view.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "./gameView/error-popup/error-popup.component";
import { GameMessagesComponent } from "./gameView/game-messages/game-messages.component";
import { RenderService } from "./scene3D/render.service";
import { GamecardComponent } from "./gamecard/gamecard.component";
import { SceneGeneratorService } from "./scene3D/scene-generator.service";
import { ShapeCreatorService } from "./scene3D/geometric/shape-creator.service";
import { MedievalObjectsCreatorService } from "./scene3D/thematic/medieval-objects-creator.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
describe("AppComponent", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        InitialComponent,
        AdminMenuComponent,
        FreeGeneratorComponent,
        SimpleGeneratorComponent,
        ListViewComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        ErrorPopupComponent,
        GameMessagesComponent,
        ErrorPopupComponent,
        GamecardComponent
      ],
      imports: [HttpClientModule, FormsModule, AppRoutingModule, MatProgressSpinnerModule, HttpClientTestingModule],
      providers: [IndexService, RenderService, SceneGeneratorService, ShapeCreatorService, MedievalObjectsCreatorService]
    }).compileComponents();
  }));
  it("should create the app", (() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
