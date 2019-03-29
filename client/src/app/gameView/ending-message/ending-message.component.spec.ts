import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndingMessageComponent } from './ending-message.component';

describe('EndingMessageComponent', () => {
  let component: EndingMessageComponent;
  let fixture: ComponentFixture<EndingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EndingMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
