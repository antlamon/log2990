import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { Scene3DComponent } from "../scene3D/scene3-d/scene3-d.component";

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({

      imports: [HttpClientModule],
      declarations: [
        ListViewComponent,
        Scene3DComponent
       ]
    })
    .compileComponents().then(() => {}, (error: Error) => {});
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
