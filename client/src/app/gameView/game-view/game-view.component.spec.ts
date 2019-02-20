import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameViewComponent } from "./game-view.component";

describe("GameViewComponent", () => {
  let component: GameViewComponent;
  let fixture: ComponentFixture<GameViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameViewComponent ]
    })
    .compileComponents().then(() => {}, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
