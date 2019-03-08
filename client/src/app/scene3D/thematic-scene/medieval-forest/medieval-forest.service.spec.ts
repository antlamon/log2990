import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { MedievalForestService } from "./medieval-forest.service";

describe("MedievalForestService", () => {
  let component: MedievalForestService;
  let fixture: ComponentFixture<MedievalForestService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedievalForestService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedievalForestService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
