import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InitialComponent } from "./initial.component";
import {FormsModule} from "@angular/forms";
import {IndexService} from "../services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";

describe("Test for the class InitialComponent using functions related to the connexion", () => {
  let component: InitialComponent;
  let fixture: ComponentFixture<InitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialComponent ],
      imports: [ FormsModule, RouterTestingModule, HttpClientModule ],
      providers: [ IndexService, AppRoutingModule ],
    })
      .compileComponents().then(() => { }, (error: Error) => {
        console.error(error);
      });
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
