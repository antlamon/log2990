import { TestBed } from "@angular/core/testing";

import { GameManagerService } from "./game-manager.service";
import { IGame } from "../../../../common/models/game";
import { IGame3D, IDifference } from "../../../../common/models/game3D";
import { IObjet3D } from "../../../../common/models/objet3D";
import { IScore } from "../../../../common/models/top3";
import { GameService } from "./game.service";
import { SIMPLE_GAME_TYPE, FREE_GAME_TYPE } from "../../../../common/communication/message";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RenderService } from "../scene3D/render.service";
import { SceneGeneratorService } from "../scene3D/scene-generator.service";
import { ShapeCreatorService } from "../scene3D/geometric/shape-creator.service";
import { MedievalObjectsCreatorService } from "../scene3D/thematic/medieval-objects-creator.service";
import { of } from "rxjs";
let service: GameManagerService;
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
describe("GameManagerService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [GameService, RenderService, SceneGeneratorService, ShapeCreatorService, MedievalObjectsCreatorService],
    imports: [HttpClientModule, HttpClientTestingModule]
  }));

  it("should be created", () => {
    service = TestBed.get(GameManagerService);
    expect(service).toBeTruthy();
  });
  describe("Adding games", () => {
    it("Adding a simple games should change the simple games array", () => {
      service["_simpleGames"] = [];
      service.addSimpleGame(mockSimple);
      expect(service["_simpleGames"].length).toEqual(1);
    });
    it("Adding a free games should change the simple games array", () => {
      service["_freeGames"] = [];
      service.addFreeGame(mockGame3D);
      expect(service["_freeGames"].length).toEqual(1);
    });
  });
  describe("Removing games", () => {
    it("Deleting a simple games should change the simple games array", () => {
      service["_simpleGames"] = [mockSimple];
      service.removeSimpleGame(mockSimple.id);
      expect(service["_simpleGames"].length).toEqual(0);
    });
    it("Adding a free games should change the simple games array", () => {
      service["_freeGames"] = [mockGame3D];
      service.removeFreeGame(mockGame3D.id);
      expect(service["_freeGames"].length).toEqual(0);
    });
  });
  describe("Getting games", () => {
    it("Should define simple games when getting simpleGames", async () => {
      spyOn(service["gameService"], "getSimpleGames").and.returnValue(of([mockSimple]));
      await service.getSimpleGames();
      expect(service["_simpleGames"]).toEqual([mockSimple]);
    });
    it("Should define free games when getting free games", async () => {
      spyOn(service["gameService"], "getFreeGames").and.returnValue(of([mockGame3D]));
      await service.getFreeGames();
      expect(service["_freeGames"]).toEqual([mockGame3D]);
    });
  });
  describe("Updating score", () => {
    it("Updating a simple game score should modify the simple games array", () => {
      service["_simpleGames"] = [mockSimple];
      service.updateScore({id: mockSimple.id, gameType: SIMPLE_GAME_TYPE, solo: [], multi: []});
      expect(service["_simpleGames"][0].solo).toEqual([]);
      expect(service["_simpleGames"][0].multi).toEqual([]);
    });
    it("Updating a free game score should modify the free games array", () => {
      service["_freeGames"] = [mockGame3D];
      service.updateScore({id: mockGame3D.id, gameType: FREE_GAME_TYPE, solo: [], multi: []});
      expect(service["_freeGames"][0].solo).toEqual([]);
      expect(service["_freeGames"][0].multi).toEqual([]);
    });
  });
});
