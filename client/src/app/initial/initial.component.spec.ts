import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { InitialComponent } from "./initial.component";
import {FormsModule} from "@angular/forms";
import {IndexService} from '../services/index.service';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";
import { Observable, of } from "rxjs";
import { Message, ERROR_ID, BASE_ID } from "../../../../common/communication/message";

describe("Test for the class InitialComponent using functions related to the connexion", () => {
  let component: InitialComponent;
  let fixture: ComponentFixture<InitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialComponent ],
      imports: [ FormsModule, RouterTestingModule, HttpClientModule ],
      providers: [ IndexService, AppRoutingModule ], 
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

  describe("test for the function connect",()=>{
    it("should change view if response is valid", ()=>{
      spyOn(component["indexService"],"connect").and.callFake((username:string):Observable<Message>=>{
        return of({title:BASE_ID,body:"test-message"});
      });
      let navigateSpy = spyOn((<any>component).router, 'navigate');
      component.connect("test123");
      expect(navigateSpy).toHaveBeenCalledWith(['games']);
    });

    it("should not change view if reponse is not valid", ()=>{
      spyOn(component["indexService"],"connect").and.callFake((username:string):Observable<Message>=>{
        return of({title:ERROR_ID,body:"test-message"});
      });
      let navigateSpy = spyOn((<any>component).router, 'navigate');
      component.connect("test123");
      expect(navigateSpy).toHaveBeenCalledTimes(0);
    });
  });

});
