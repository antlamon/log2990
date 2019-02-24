import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { GameViewComponent } from "../gameView/game-view/game-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";
import { Scene3DComponent } from "../scene3D/scene3-d/scene3-d.component";
import { IGame } from "../../../../common/models/game";
import { ITop3 } from "../../../../common/models/top3";
import { IGame3D } from "../../../../common/models/game3D";

const mockSimple: IGame = {
  id: "idSimple",
  name: "nameSimple",
  originalImage: "",
  solo: {first: {name: " ", score: ""}, second: {name: " ", score: ""}, third: {name: " ", score: ""}},
  multi: {first: {name: " ", score: ""}, second: {name: " ", score: ""}, third: {name: " ", score: ""}},
};
const mockGame3D: IGame3D = {
  name: "mock3DName",
  id: "",
  originalScene: { modified: false, numObj: -1, objects: [], backColor: -1, },
  modifiedScene: { modified: true, numObj: -1, objects: [], backColor: -1, },
  solo: { } as ITop3,
  multi: { } as ITop3,
};

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppRoutingModule,
        FormsModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        GameViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        Scene3DComponent
      ]
    })
      .compileComponents().then(() => { }, (error: Error) => { });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should route to game Play with the proper iD", () => {
    const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate");
    const game: IGame = {
      id: "",
      name: "string",
      originalImage: "string",
      solo: {} as ITop3,
      multi:  {} as ITop3
    };
    component.playSelectedSimpleGame(game);
    expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + game.id]);
  });

  describe("Delete functions", () => {
    it("Deleting an existing simple games should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      component.simpleGames = [];
      component.simpleGames.push(mockSimple);
      component.deleteSimpleGames(mockSimple);
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("Deleting a non existing simple games should not call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteSimpleGame").and.returnValue({subscribe: () => []});
      component.simpleGames = [];
      component.deleteSimpleGames(mockSimple);
      expect(gameServiceSpy).toHaveBeenCalledTimes(0);
    });
    it("Deleting an existing free games should call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      component.freeGames = [];
      component.freeGames.push(mockGame3D);
      component.deleteFreeGames(mockGame3D);
      expect(gameServiceSpy).toHaveBeenCalledTimes(1);
    });

    it("Deleting a non existing free games should not call the game service", () => {
      const gameServiceSpy: jasmine.Spy = spyOn(component["gameService"], "deleteFreeGame").and.returnValue({subscribe: () => []});
      component.freeGames = [];
      component.deleteFreeGames(mockGame3D);
      expect(gameServiceSpy).toHaveBeenCalledTimes(0);
    });
  });

});
