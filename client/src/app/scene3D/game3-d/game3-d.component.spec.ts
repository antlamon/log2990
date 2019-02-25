import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { Game3DComponent } from "./game3-d.component";

describe("Game3DComponent", () => {
  let component: Game3DComponent;
  let fixture: ComponentFixture<Game3DComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game3DComponent ]
    })
    .compileComponents().catch();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
