import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EndingMessageComponent } from './ending-message.component';
import { ModalService } from 'src/app/services/modal.service';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { AdminMenuComponent } from 'src/app/adminView/admin-menu/admin-menu.component';
import { ListViewComponent } from 'src/app/list-view/list-view.component';
import { InitialComponent } from 'src/app/initial/initial.component';
import { Game2DViewComponent } from '../game2D-view/game2D-view.component';
import { Game3DViewComponent } from '../game3D-view/game3D-view.component';
import { GameMessagesComponent } from '../game-messages/game-messages.component';
import { WaitingComponent } from 'src/app/waiting/waiting.component';
import { SimpleGeneratorComponent } from 'src/app/adminView/simple-generator/simple-generator.component';
import { FreeGeneratorComponent } from 'src/app/adminView/free-generator/free-generator.component';
import { GamecardComponent } from 'src/app/gamecard/gamecard.component';
import { MatProgressSpinnerModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { ErrorPopupComponent } from '../error-popup/error-popup.component';
import { By } from '@angular/platform-browser';

describe('EndingMessageComponent', () => {
  let component: EndingMessageComponent;
  let fixture: ComponentFixture<EndingMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        EndingMessageComponent,
        AdminMenuComponent,
        ListViewComponent,
        InitialComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        GameMessagesComponent,
        WaitingComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        GamecardComponent,
        ErrorPopupComponent
      ],
      imports: [ AppRoutingModule, MatProgressSpinnerModule, FormsModule ],
      providers: [ ModalService ]
    })
    .compileComponents().then(() => { }, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EndingMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it("The router should be called when the user click on the ending message", () => {
    const spy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
    component.submit();
    expect(spy).toHaveBeenCalledWith(["games"]);
  });

  // it("The submit should be called when the user click on the ending message", () => {
  //   const input: Element = fixture.debugElement.query(By.css("messageForm")).nativeElement;

  //   spyOn(component, "submit");

  //   input.dispatchEvent(new Event("click"));

  //   expect(component.submit).toHaveBeenCalled();
  // });
});
