import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { GamecardComponent } from "./gamecard.component";
import { AppRoutingModule } from "../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import {} from "jasmine";
import { MatProgressSpinnerModule } from "@angular/material";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { WAITING_PATH } from "../global/constants";
import { NewMultiplayerGame, INewGameMessage } from "../../../../common/communication/message";
import { IndexService } from "../services/index.service";
const mockSimple: IGame = {
  id: "idSimple",
  name: "nameSimple",
  originalImage: "",
  solo: [],
  multi: [],
};
const mockGame3D: IGame3D = {
  name: "mock3DName",
  id: "",
  originalScene: [],
  solo: [],
  multi: [],
  differences: [],
  isThematic: false,
  backColor: 0,
};
const mockGameMessage: INewGameMessage = {
  gameId: "",
  gameName: "",
  username: "",
  is3D: false,
};
describe("GamecardComponent", () => {
  let component: GamecardComponent;
  let fixture: ComponentFixture<GamecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamecardComponent ],
      imports: [HttpClientModule, RouterTestingModule, MatProgressSpinnerModule, HttpClientTestingModule],
      providers: [AppRoutingModule, IndexService]
    })
    .compileComponents().catch((error: Error) => console.error(error));
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("PlaySelectedGame function", () => {
    it("should route to game simple Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component["game"] = mockSimple;
      component.playSelectedGame();
      expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + mockSimple.id], {queryParams: {gameRoomId: component["joinableGameRoomId"]}});
    });
    it("should route to game free Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component["game"] = mockGame3D;
      component.playSelectedGame();
      expect(routeSpy).toHaveBeenCalledWith(["free-game/" + mockGame3D.id], {queryParams: {gameRoomId: component["joinableGameRoomId"]}});
    });
  });

  describe("Test for admin functions", () => {
    it("Deleting the game who is a simple game should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component["game"] = mockSimple;
      component.deleteGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
    it("Deleting the game who is a free game should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component["game"] = mockGame3D;
      component.deleteGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
    it("The reinit function should call the game service function : resetScore", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "resetScore").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component["game"] = mockSimple;
      component.reinitGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
  describe("CreateMultiGame function", () => {
    it("should route to the waiting view with the gameID when called", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component.createMultiGame();
      expect(routeSpy).toHaveBeenCalledWith([WAITING_PATH + component["game"].id]);
    });
  });
  describe("joinMultiGame function", () => {
    it("should route to game simple Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component["game"] = mockSimple;
      component.joinMultiGame();
      expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + mockSimple.id], {queryParams: {gameRoomId: component["joinableGameRoomId"]}});
    });
    it("should route to game free Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component["game"] = mockGame3D;
      component.joinMultiGame();
      expect(routeSpy).toHaveBeenCalledWith(["free-game/" + mockGame3D.id], {queryParams: {gameRoomId: component["joinableGameRoomId"]}});
    });
  });
  describe("HandleNewMultiPlayerGame function", () => {
    it("should set isJoinable to true if the game has the proper ID", () => {
      const newMultiplayerGame: NewMultiplayerGame = {
        gameId: mockSimple.id,
        gameRoomId: "1234"
      };
      component["game"] = mockSimple;
      component["handleNewMulitplayerGamer"](newMultiplayerGame);
      expect(component["isJoinable"]).toEqual(true);
    });
    it("isJoinable should not change if the game doesnt have the proper ID", () => {
      const initialValue: boolean = component["isJoinable"];
      const newMultiplayerGame: NewMultiplayerGame = {
        gameId: "badID",
        gameRoomId: "1234"
      };
      component["game"] = mockSimple;
      component["handleNewMulitplayerGamer"](newMultiplayerGame);
      expect(component["isJoinable"]).toEqual(initialValue);
    });
  });
  describe("resetJoinableGame function", () => {
    it("should set isJoinable to false if the game has the proper ID", () => {
      component["game"] = mockSimple;
      mockGameMessage.gameId = mockSimple.id;
      component["resetJoinableGame"](mockGameMessage);
      expect(component["isJoinable"]).toEqual(false);
    });
    it("isJoinable should not change if the game doesnt have the proper ID", () => {
      const initialValue: boolean = component["isJoinable"];
      component["game"] = mockSimple;
      mockGameMessage.gameId = mockSimple.id;
      component["resetJoinableGame"](mockGameMessage);
      expect(component["isJoinable"]).toEqual(initialValue);
    });
  });
});
