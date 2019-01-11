import { TestBed, async } from '@angular/core/testing';
import { AppComponent, add } from './app.component';
import { FormsModule } from '@angular/forms';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        FormsModule
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Calculatrice'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('Calculatrice');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to Calculatrice!');
  });

  it('For an empty string add returns 0', () => {
    expect(add('')).toEqual(0);
  });

  it('For a simgle number, add returns the number', () => {
    expect(add('6')).toEqual(6);
  });

  it('For two numbers, add returns the sum of the two numbers', () => {
    expect(add('5,7')).toEqual(12);
  });

  it('For an indefinite number of numbers, add returns the sum of all numbers', () => {
    expect(add('5,7,3,2,1')).toEqual(18);
  });

  it('User can une /n instead of ,', () => {
    expect(add('5\n7,3,2\n1')).toEqual(18);
  });

  it('For an indefinite number of numbers, add returns the sum of all numbers', () => {
    expect(add('1,\n2')).toEqual(NaN);
  });

  it('update the separator', () => {
    expect(add('//;\n1\n2;6;1')).toEqual(10);
  });
});
