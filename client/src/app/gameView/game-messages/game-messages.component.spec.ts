import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameMessagesComponent } from './game-messages.component';

describe('GameMessagesComponent', () => {
  let component: GameMessagesComponent;
  let fixture: ComponentFixture<GameMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMessagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
