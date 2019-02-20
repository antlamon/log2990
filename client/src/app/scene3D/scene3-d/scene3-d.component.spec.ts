import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { Scene3DComponent } from "./scene3-d.component";
import { RenderService } from "./render.service";
import { ShapeCreatorService } from "./shape-creator.service";

describe("Scene3DComponent", () => {
  let component: Scene3DComponent;
  let fixture: ComponentFixture<Scene3DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Scene3DComponent ],
      providers: [ RenderService, ShapeCreatorService ],
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Scene3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
