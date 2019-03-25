import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameMessagesComponent } from "./game-messages.component";
import { GameRoomUpdate } from "../../../../../common/communication/message";

const mockUsername: string = "test";
const mockEventType: string = "userConnected";

describe("GameMessagesComponent", () => {
  let component: GameMessagesComponent;
  let fixture: ComponentFixture<GameMessagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameMessagesComponent ]
    })
    .compileComponents().then(() => { }, (error: Error) => { });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameMessagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  describe("Pushing game messages", () => {
    it("handle new identification should push a new message in the array", () => {
      component.gameMessages = [];
      const update: GameRoomUpdate = {
        username: "test",
        newImage: "testImage",
        differencesFound: -1,
      };
      component.handleNewIdentification(update);
      expect(component.gameMessages.length).toEqual(1);
    });

    it("handle connection should push a new message in the array", () => {
      component.gameMessages = [];
      component.handleConnection(mockUsername, mockEventType);
      expect(component.gameMessages.length).toEqual(1);
    });

    it("handle new best time should push a new message in the array", () => {
      component.gameMessages = [];
      component.handleNewBestTime(mockUsername, "1", "0");
      expect(component.gameMessages.length).toEqual(1);
    });
  });

});
