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
import { GameViewComponent } from "src/app/gameView/game-view/game-view.component";

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
        GameViewComponent
      ],
      imports: [AppRoutingModule, FormsModule, HttpClientModule],
      providers: [ModalService]
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
});
