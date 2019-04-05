import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WaitingComponent } from "./waiting.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AppRoutingModule } from "../app-routing.module";
import { IndexService } from "../services/index.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { INewGameMessage } from "../../../../common/communication/message";

describe("WaitingComponent", () => {
  let component: WaitingComponent;
  let fixture: ComponentFixture<WaitingComponent>;
  const mocked3DGame: IGame3D = {
    name: "testGame",
    id: "free",
    originalScene: [],
    solo: [],
    multi: [],
    differences: [],
    isThematic: false,
    backColor: 0,
  };
  const mocked2DGame: IGame = {
    name: "testGame",
    originalImage: "testImage",
    id: "simple" ,
    solo: [],
    multi: [],
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingComponent ],
      imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule],
      providers: [ AppRoutingModule, IndexService ],
    })
    .compileComponents().then(() => { }, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  describe("StartGame function", () => {
    it("should route to game simple Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue(mocked2DGame.id);
      component["startGame"]({gameId: mocked2DGame.id, gameRoomId: "1234", is3D: false} as INewGameMessage);
      expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + mocked2DGame.id]);
    });
    it("should route to game free Play with the proper iD", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue(mocked3DGame.id);
      component["startGame"]({gameId: mocked3DGame.id, gameRoomId: "1234", is3D: false} as INewGameMessage);
      expect(routeSpy).toHaveBeenCalledWith(["free-game/" + mocked3DGame.id]);
    });
    it("should NOT route to game simple Play when the iD is not the right one", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue("wrongID");
      component["startGame"]({gameId: mocked2DGame.id, gameRoomId: "1234", is3D: false} as INewGameMessage);
      expect(routeSpy).toHaveBeenCalledTimes(0);
    });
    it("should NOT route to game free Play when the iD is not the right one", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue("wrongID");
      component["startGame"]({gameId: mocked3DGame.id, gameRoomId: "1234", is3D: false} as INewGameMessage);
      expect(routeSpy).toHaveBeenCalledTimes(0);
    });
  });
  describe("Cancel function", () => {
    it("should route back to the game list when called", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      component.cancel();
      expect(routeSpy).toHaveBeenCalledWith(["games"]);
    });
  });
  describe("HandleGameDeleted function", () => {
    it("should route back to the games list ONLY if it has the correct ID", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue("goodId");
      component["handleGameDeleted"]("goodId");
      expect(routeSpy).toHaveBeenCalledWith(["games"]);
    });
    it("should NOT route back to the games list if it DOES NOT have the correct ID", () => {
      const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
      // tslint:disable-next-line:no-any
      spyOn<any>(component, "getId").and.returnValue("goodId");
      component["handleGameDeleted"]("wrongID");
      expect(routeSpy).toHaveBeenCalledTimes(0);
    });
  });
});
