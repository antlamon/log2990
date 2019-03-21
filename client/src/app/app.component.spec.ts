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
import { Scene3DComponent } from "./scene3D/geometric-scene/scene3-d.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { ThematicSceneComponent } from "./scene3D/thematic-scene/thematic-scene.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "./gameView/error-popup/error-popup.component";
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
        Scene3DComponent,
        ThematicSceneComponent,
        ErrorPopupComponent
      ],
      imports: [HttpClientModule, FormsModule, AppRoutingModule, MatProgressSpinnerModule],
      providers: [IndexService]
    }).compileComponents();
  }));
  it("should create the app", (() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
