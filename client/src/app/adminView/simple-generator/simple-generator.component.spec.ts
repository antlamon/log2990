import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleGeneratorComponent } from './simple-generator.component';

import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { FreeGeneratorComponent } from '../free-generator/free-generator.component';

describe('SimpleGeneratorComponent', () => {
  let component: SimpleGeneratorComponent;
  let fixture: ComponentFixture<SimpleGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SimpleGeneratorComponent, AdminMenuComponent, FreeGeneratorComponent ],
      imports: [ AppRoutingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe("Test for the function checkModifiedExtention and checkOriginalExtension",()=> {
    it('A .jpeg should return false', () => {
      expect(component.checkModifiedExtension('testFile.jpeg') && component.checkOriginalExtension('testFile.jpeg')).toEqual(false);
    });
    it('A .bmp should return true', () => {
      expect(component.checkModifiedExtension('testFile.bmp') && component.checkOriginalExtension('testFile.bmp')).toEqual(true);
    });
    it('An empty value should return false', () => {
      expect(component.checkModifiedExtension('') && component.checkOriginalExtension('')).toEqual(false);
    });
  });

  // describe("Test for the function checkModifiedExtention and checkOriginalExtension",()=> {
  //   it('A .jpeg should return false', () => {
  //     expect(component.checkModifiedExtension('testFile.jpeg') && component.checkOriginalExtension('testFile.jpeg')).toEqual(false);
  //   });
  //   it('A .bmp should return true', () => {
  //     expect(component.checkModifiedExtension('testFile.bmp') && component.checkOriginalExtension('testFile.bmp')).toEqual(true);
  //   });
  //   it('An empty value should return false', () => {
  //     expect(component.checkModifiedExtension('') && component.checkOriginalExtension('')).toEqual(false);
  //   });
  // });

});
