import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InitialComponent } from "./initial.component";
import {FormsModule} from "@angular/forms";
// import {IndexService} from '../index.service';

describe("Test for the class InitialComponent using functions related to the connexion", () => {
  let component: InitialComponent;
  let fixture: ComponentFixture<InitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialComponent ],
      imports: [FormsModule],
      providers: [IndexService],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
