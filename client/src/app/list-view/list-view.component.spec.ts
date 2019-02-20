import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { GameViewComponent } from "../gameView/game-view/game-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppRoutingModule,
        FormsModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        GameViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent
      ]
    })
    .compileComponents().then(() => {}, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
