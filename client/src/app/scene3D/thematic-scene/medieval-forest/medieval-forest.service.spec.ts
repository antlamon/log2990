import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MedievalForestComponent } from "./medieval-forest.service";

describe("MedievalForestComponent", () => {
  let component: MedievalForestComponent;
  let fixture: ComponentFixture<MedievalForestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedievalForestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedievalForestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
