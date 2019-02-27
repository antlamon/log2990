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
import { Scene3DComponent } from "src/app/scene3D/scene3-d/scene3-d.component";
import { Game3DViewComponent } from "src/app/gameView/game3D-view/game3D-view.component";

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
        Scene3DComponent
      ],
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [ModalService]
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
