import { TestBed, async,  inject  } from "@angular/core/testing";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { IGame3D, IDifference, ADD_TYPE } from "../../../../../common/models/game3D";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import {} from "jasmine";
import { IScore } from "../../../../../common/models/top3";
import { GamecardComponent } from "../../gamecard/gamecard.component";
import { SocketService } from "src/app/services/socket.service";

import { KEYS } from "src/app/global/constants";
import { IndexService } from "src/app/services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { SceneGeneratorService } from "../scene-generator.service";
import { MedievalObjectsCreatorService } from "../medieval-objects-creator.service";
describe("renderService", () => {
  const cone: IObjet3D = {
    type: "cone",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "0",
  };
  const cube: IObjet3D = {
    type: "cube",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "1",
  };
  const cylinder: IObjet3D = {
    type: "cylinder",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "2",
  };
  const mockObjects: IObjet3D[] = [cone, cube, cylinder];

  const differences: IDifference[] = [
    {
    type: ADD_TYPE,
    object: cone,
    name: "3",
   },
    {
    type: ADD_TYPE,
    object: cube,
    name: "4",
   }
  ];
  const mockGame: IGame3D = {
    name: "mock",
    id: "mockid",
    originalScene: mockObjects,
    solo: [] as IScore[],
    multi: [] as IScore[],
    differences: differences,
    isThematic: false,
    backColor: 0xFFFFFF,
  };
  const container1: HTMLDivElement = document.createElement("div");
  const container2: HTMLDivElement = document.createElement("div");
  const mockSocketService: SocketService = new SocketService();
  mockSocketService["socket"] = jasmine.createSpyObj("socket", ["on", "emit"]);
  const service: RenderService = new RenderService(
    new SceneGeneratorService(new ShapeCreatorService(), new MedievalObjectsCreatorService()));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ RenderService, ShapeCreatorService, GamecardComponent, IndexService ],
      imports: [HttpClientModule]
    })
    .compileComponents().catch();
  }));

  it("should be created", inject([RenderService], (serv: RenderService) => {
    expect(serv).toBeTruthy();
    service["sceneOriginal"] = new THREE.Scene();
    service["sceneModif"] = new THREE.Scene();
  }));

  describe("Test for calls within the initialize function", async () => {
    it("container property should be properly affected", async () => {
      await service.initialize(container1, container2, mockGame);
      expect(service["containerOriginal"]).toEqual(container1);
    });
    it("should give the background color given in parameters at creation", async () => {
      await service.initialize(container1, container2, mockGame);
      expect(service["sceneOriginal"].background).toEqual(new THREE.Color(mockGame.backColor));
    });
  });
  describe("Test for the resize function", () => {
    it("should change the camera aspect ratio for the new one", () => {
      service.onResize();
      const width: number = service["containerOriginal"].clientWidth;
      const height: number = service["containerOriginal"].clientHeight;
      expect(service["camera"].aspect).toEqual(width / height);
    });
    it("should update the projection matrix", () => {
      const spyProjectionMatrix: jasmine.Spy = spyOn(service["camera"], "updateProjectionMatrix");
      service.onResize();
      expect(spyProjectionMatrix).toHaveBeenCalled();
    });
    it("should set the new size when resized", async () => {
      await service.initialize(container1, container2, mockGame);
      const spyRenderer: jasmine.Spy = spyOn(service["rendererO"], "setSize");
      service.onResize();
      const width: number = service["containerOriginal"].clientWidth;
      const height: number = service["containerOriginal"].clientHeight;
      expect(spyRenderer).toHaveBeenCalledWith(width, height);
    });
  });
});
