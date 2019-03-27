import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ErrorPopupComponent } from "./error-popup.component";

describe("ErrorPopupComponent", () => {
  let component: ErrorPopupComponent;
  let fixture: ComponentFixture<ErrorPopupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorPopupComponent ]
    })
    .compileComponents().catch((error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("Should should block popup when showing error", () => {
    component.showPopup(1, 1);
    expect(component.errorPopupDisplay).toEqual("block");
  });
  it("Should should block popup when showing error", () => {
    component.hidePopup();
    expect(component.errorPopupDisplay).toEqual("none");
  });
});
