import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientModule } from "@angular/common/http";
import { GamecardComponent } from "./gamecard.component";
import { AppRoutingModule } from "../app-routing.module";
import { RouterTestingModule } from "@angular/router/testing";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import {} from "jasmine";
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
describe("GamecardComponent", () => {
  let component: GamecardComponent;
  let fixture: ComponentFixture<GamecardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GamecardComponent ],
      imports: [HttpClientModule, RouterTestingModule],
      providers: [AppRoutingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GamecardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
  it("should route to game simple Play with the proper iD", () => {
    const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
    component.game = mockSimple;
    component.playSelectedGame();
    expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + mockSimple.id]);
  });
  it("should route to game free Play with the proper iD", () => {
    const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
    component.game = mockGame3D;
    component.playSelectedGame();
    expect(routeSpy).toHaveBeenCalledWith(["free-game/" + mockGame3D.id]);
  });

  describe("Test for admin functions", () => {
    it("Deleting the game who is a simple game should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component.game = mockSimple;
      component.deleteGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
    it("Deleting the game who is a free game should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component.game = mockGame3D;
      component.deleteGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
    it("The reinit function should call the game service function : resetScore", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "resetScore").and.returnValue({subscribe: () => []});
      spyOn(window, "confirm").and.returnValue(true);
      component.game = mockSimple;
      component.reinitGame();
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });
  });
});
