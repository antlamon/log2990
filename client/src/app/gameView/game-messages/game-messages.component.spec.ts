import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { GameMessagesComponent } from "./game-messages.component";
import { GameRoomUpdate, ScoreUpdate } from "../../../../../common/communication/message";

const ARRAY_TWO_MESSAGES: number = 2;
const mockUsername: string = "test";
const mockConnectedEvent: string = "userConnected";
const mockDisconnectedEvent: string = "userDisconnected";

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
      component["gameMessages"] = [];
      const updateError: GameRoomUpdate = {
        username: "test",
        newImage: "testImage",
        differencesFound: -1,
        isGameOver: false,
      };
      const updateDifferenceFound: GameRoomUpdate = {
        username: "test",
        newImage: "testImage",
        differencesFound: 1,
        isGameOver: false,
      };
      component.handleNewIdentification(updateError);
      component.handleNewIdentification(updateDifferenceFound);
      expect(component["gameMessages"].length).toEqual(ARRAY_TWO_MESSAGES);
    });

    it("handle connection should push a new message in the array", () => {
      component["gameMessages"] = [];
      component.handleConnection(mockUsername, mockConnectedEvent);
      component.handleConnection(mockUsername, mockDisconnectedEvent);
      expect(component["gameMessages"].length).toEqual(ARRAY_TWO_MESSAGES);
    });

    it("handle new best time should push a new message in the array", () => {
      component["gameMessages"] = [];
      component.handleNewBestTime({
        scoreUpdate: {insertPos: 1} as ScoreUpdate,
        gameMode: "solo",
        gameName: "hello",
        username: mockUsername
      });
      expect(component["gameMessages"].length).toEqual(1);
    });
  });

});
