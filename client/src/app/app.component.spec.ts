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
import { GameViewComponent } from "./gameView/game-view/game-view.component";

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
        GameViewComponent
      ],
      imports: [HttpClientModule, FormsModule, AppRoutingModule],
      providers: [IndexService]
    }).compileComponents();
  }));
  it("should create the app", (() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
  it(`should have as title 'client'`, (() => {
    const fixture: ComponentFixture<AppComponent> = TestBed.createComponent(AppComponent);
    const app: any = fixture.debugElement.componentInstance;
    expect(app.title).toEqual("LOG2990");
  }));
});
