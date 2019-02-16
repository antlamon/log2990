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
import { Scene3DComponent } from "src/app/scene3D/scene3-d/scene3-d.component";

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
        Scene3DComponent
      ],
      imports: [
        AppRoutingModule,
        FormsModule,
        HttpClientModule
      ],
      providers: [ModalService, FreeGeneratorComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
