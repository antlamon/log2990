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

  describe("Test for the function containAlphaNumerics",()=> {
    it('A string containing only regular char should return true', () => {
      expect(initialComponent.containOnlyAlphaNumeric("abc123")).toEqual(true);
    });
    it('An empty should return false', () => {
      expect(initialComponent.containOnlyAlphaNumeric("")).toEqual(false);
    });
    it('A string containing @ should return false', () => {
      expect(initialComponent.containOnlyAlphaNumeric("@")).toEqual(false);
    });
    it('A string containing both alpha numerics char and non alpha numerics char should return false', () => {
      expect(initialComponent.containOnlyAlphaNumeric("abc123@")).toEqual(false);
    });
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
