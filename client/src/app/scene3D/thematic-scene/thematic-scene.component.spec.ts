import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThematicSceneComponent } from './thematic-scene.component';

describe('ThematicSceneComponent', () => {
  let component: ThematicSceneComponent;
  let fixture: ComponentFixture<ThematicSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThematicSceneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThematicSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
