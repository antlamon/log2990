import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialComponent } from './initial.component';
import {FormsModule} from "@angular/forms";

describe("Test for the class InitialComponent using functions related to the connexion",()=>{
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

  describe("Test for the function containAlphaNumerics",()=> {
    it('A string containing only regular char should return true', () => {
      expect(component.containOnlyAlphaNumeric("abc123")).toEqual(true);
    });
    it('An empty should return false', () => {
      expect(component.containOnlyAlphaNumeric("")).toEqual(false);
    });
    it('A string containing @ should return false', () => {
      expect(component.containOnlyAlphaNumeric("@")).toEqual(false);
    });
    it('A string containing both alpha numerics char and non alpha numerics char should return false', () => {
      expect(component.containOnlyAlphaNumeric("abc123@")).toEqual(false);
    });
  });

  describe("Test for the function isValidUsername",()=> {
    it('An empty username should return false', () => {
      expect(component.isValidUsername("")).toEqual(false);
    });
    it('A username under 3 char should return false', () => {
      expect(component.isValidUsername("aa")).toEqual(false);
    });
    it('A username above 10 char should return false', () => {
      expect(component.isValidUsername("aaaaaaaaaaa")).toEqual(false);
    });
    it('A username containing unvalide char should return false', () => {
      expect(component.isValidUsername("aa@@aa")).toEqual(false);
    });
    it('An ordinary username between 3 and 10 char sould return true', () => {
      expect(component.isValidUsername("aaaaa")).toEqual(true);
    });
  });

  describe("Test for the function connect",()=> {
    it('An empty username should not be added to the names array', () => {
      component.connect("");
      expect(component.names.some(o=>o=="")).toEqual(false);
    });
    it('An  username longer than 10 chars should not be added', () => {
      component.connect("aaa@@aa");
      expect(component.names.some(o=>o=="")).toEqual(false);
    });
    it('An  username shorter than 3 characters should not be added to the names array', () => {
      component.connect("aaa@@aa");
      expect(component.names.some(o=>o=="")).toEqual(false);
    });
    it('An  username containing alphaNumerics chars should not be added to the names array', () => {
      component.connect("aaa@@aa");
      expect(component.names.some(o=>o=="")).toEqual(false);
    });
    it('The username HanasBye should be correctly added', () => {
      component.connect("HanasBye");
      expect(component.names.some(o=>o=="HanasBye")).toEqual(true);
    });
    it('The username HanasBye should not be added twice', () => {
      component.connect("HanasBye");
      component.connect("HanasBye");
      expect(component.names.filter(o=>o=="HanasBye").length).toEqual(1);
    });
  });

});
