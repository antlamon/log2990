import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game2DViewComponent } from "./game2D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";

describe("Game2DViewComponent", () => {
  let component: Game2DViewComponent;
  let fixture: ComponentFixture<Game2DViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game2DViewComponent ],
      imports: [ HttpClientModule, RouterModule.forRoot([]) ]
    })
    .compileComponents().then(() => {}, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game2DViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
