import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { Game2DViewComponent } from "../gameView/game2D-view/game2D-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";
import { IGame } from "../../../../common/models/game";
import { IGame3D, IDifference } from "../../../../common/models/game3D";
import { Game3DViewComponent } from "../gameView/game3D-view/game3D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "../gameView/error-popup/error-popup.component";
import { IObjet3D } from "../../../../common/models/objet3D";
import { IScore } from "../../../../common/models/top3";
import { RenderService } from "../scene3D/scene3-d/render.service";
import { GamecardComponent } from "../gamecard/gamecard.component";
const mockSimple: IGame = {
  id: "idSimple",
  name: "nameSimple",
  originalImage: "",
  solo: [{name: "mock", score: ""}],
  multi: [{name: "mock", score: ""}],
};
const mockGame3D: IGame3D = {
  name: "mock3DName",
  id: "",
  originalScene: [] as IObjet3D[],
  solo: [{name: "mock", score: ""}] as IScore[],
  multi: [{name: "mock", score: ""}] as IScore[],
  differences: [] as IDifference[],
  isThematic: false,
  backColor: 0,
};

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        FormsModule,
        MatProgressSpinnerModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        Game2DViewComponent,
        Game3DViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        Game3DViewComponent,
        ErrorPopupComponent,
        GamecardComponent
      ],
      providers: [RenderService],
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
  describe("Adding games", () => {
    it("Adding a simple games should change the simple games array", () => {
      component.simpleGames = [];
      component.addSimpleGame(mockSimple);
      expect(component.simpleGames.length).toEqual(1);
    });
    it("Adding a free games should change the simple games array", () => {
      component.freeGames = [];
      component.addFreeGame(mockGame3D);
      expect(component.freeGames.length).toEqual(1);
    });
  });
  describe("Removing games", () => {
    it("Deleting a simple games should change the simple games array", () => {
      component.simpleGames = [mockSimple];
      component.removeSimpleGame(mockSimple.id);
      expect(component.simpleGames.length).toEqual(0);
    });
    it("Adding a free games should change the simple games array", () => {
      component.freeGames = [mockGame3D];
      component.removeFreeGame(mockGame3D.id);
      expect(component.freeGames.length).toEqual(0);
    });
  });
  describe("Updating score", () => {
    it("Updating a simple game score should modify the simple games array", () => {
      component.simpleGames = [mockSimple];
      component.updateScore({id: mockSimple.id, gameType: "simple", solo: [], multi: []});
      expect(component.simpleGames[0].solo).toEqual([]);
      expect(component.simpleGames[0].multi).toEqual([]);
    });
    it("Updating a free game score should modify the free games array", () => {
      component.freeGames = [mockSimple];
      component.updateScore({id: mockSimple.id, gameType: "free", solo: [], multi: []});
      expect(component.freeGames[0].solo).toEqual([]);
      expect(component.freeGames[0].multi).toEqual([]);
    });
  });

});
