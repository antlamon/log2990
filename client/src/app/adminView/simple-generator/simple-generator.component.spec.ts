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

describe("SimpleGeneratorComponent", () => {
  let component: SimpleGeneratorComponent;
  let fixture: ComponentFixture<SimpleGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SimpleGeneratorComponent,
        AdminMenuComponent,
        FreeGeneratorComponent,
        InitialComponent,
        ListViewComponent
      ],
      imports: [ AppRoutingModule, FormsModule, HttpClientModule ],
      providers: [ModalService, FileValidatorService, GameService]
    })
    .compileComponents().then(() => {}, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(SimpleGeneratorComponent);
    component = fixture.componentInstance;
    component.id="tempId";
    fixture.detectChanges();
  
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
