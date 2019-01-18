import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialComponent } from './initial.component';
import {FormsModule} from "@angular/forms";

let initialComponent:InitialComponent;

describe('InitialComponent', () => {
  let component: InitialComponent;
  let fixture: ComponentFixture<InitialComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InitialComponent ],
      imports: [FormsModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InitialComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

describe("Test for the class InitialComponent using functions related to the connexion",()=>{

  beforeEach(() => {
    initialComponent = new InitialComponent();
  });

  it('A username should return false', () => {
    expect(initialComponent.isValidUsername("")).toEqual(false);
  });

  describe("Test for the function isValidUsername",()=> {
    it('An empty username should return false', () => {
      expect(initialComponent.isValidUsername("")).toEqual(false);
    });
    it('A username under 3 char should return false', () => {
      expect(initialComponent.isValidUsername("aa")).toEqual(false);
    });
    it('A username above 10 char should return false', () => {
      expect(initialComponent.isValidUsername("aaaaaaaaaaa")).toEqual(false);
    });
    it('A username containing unvalide char should return false', () => {
      expect(initialComponent.isValidUsername("aa@@aa")).toEqual(false);
    });
    it('An ordinary username between 3 and 10 char sould return true', () => {
      expect(initialComponent.isValidUsername("aaaaa")).toEqual(true);
    });
  });

});
