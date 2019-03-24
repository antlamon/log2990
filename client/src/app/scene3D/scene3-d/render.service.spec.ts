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
import { IndexService } from "src/app/services/index.service";

describe("renderService", () => {
  const cone: IObjet3D = {
    type: "cone",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "",
  };
  const cube: IObjet3D = {
    type: "cube",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "",
  };
  const cylinder: IObjet3D = {
    type: "cylinder",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "",
  };
  const mockObjects: IObjet3D[] = [cone, cube, cylinder];

  const differences: IDifference[] = [
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
    {
    type: ADD_TYPE,
    object: cone,
    name: "",
   },
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
  const component: RenderService = new RenderService(new ShapeCreatorService(), new SocketService(),
                                                     IndexService);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ RenderService, ShapeCreatorService, GamecardComponent ]
    })
    .compileComponents().catch();
  }));

  it("should be created", inject([RenderService], (service: RenderService) => {
    expect(service).toBeTruthy();
  }));

  describe("Test for calls within the initialize function", () => {
    it("container property should be properly affected", () => {
      component.initialize(container1, container2, mockGame);
      expect(component["containerOriginal"]).toEqual(container1);
    });
    it("should give the background color given in parameters at creation", () => {
      component.initialize(container1, container2, mockGame);
      expect(component["sceneOriginal"].background).toEqual(new THREE.Color(mockGame.backColor));
    });
    it("should call createShape the right amount of times", () => {
      spyOn(component["shapeService"], "createShape");
      component.initialize(container1, null, mockGame);
      expect(component["shapeService"].createShape).toHaveBeenCalledTimes(mockGame.originalScene.length);
    });
  });
  describe("Test for the resize function", () => {
    it("should change the camera aspect ratio for the new one", () => {
      component.onResize();
      const width: number = component["containerOriginal"].clientWidth;
      const height: number = component["containerOriginal"].clientHeight;
      expect(component["camera"].aspect).toEqual(width / height);
    });
    it("should update the projection matrix", () => {
      const spyProjectionMatrix: jasmine.Spy = spyOn(component["camera"], "updateProjectionMatrix");
      component.onResize();
      expect(spyProjectionMatrix).toHaveBeenCalled();
    });
    it("should set the new size when resized", () => {
      const spyRenderer: jasmine.Spy = spyOn(component["rendererO"], "setSize");
      component.onResize();
      const width: number = component["containerOriginal"].clientWidth;
      const height: number = component["containerOriginal"].clientHeight;
      expect(spyRenderer).toHaveBeenCalledWith(width, height);
    });
  });
  describe("Tests for keyboard events", () => {
  });
});
