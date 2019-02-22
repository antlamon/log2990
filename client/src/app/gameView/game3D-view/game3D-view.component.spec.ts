import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Game3DViewComponent } from './game3D-view.component';

describe('Game3DViewComponent', () => {
  let component: Game3DViewComponent;
  let fixture: ComponentFixture<Game3DViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Game3DViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Game3DViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
