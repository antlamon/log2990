import { TestBed, async,  inject  } from "@angular/core/testing";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { IScene3D, IGame3D } from "../../../../../common/models/game3D";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";

describe("renderService", () => {
  const cone: IObjet3D = {
    type: "cone",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const cube: IObjet3D = {
    type: "cube",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const cylinder: IObjet3D = {
    type: "cylinder",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const mockObjects: IObjet3D[] = [cone, cube, cylinder];
  const mockOkScene: IScene3D = {
    modified: false,
    numObj: mockObjects.length,
    objects: mockObjects,
    backColor: 0xFF0F0F,
  };

  const mockGame: IGame3D = {
    name: "mock",
    id: "mockid",
    originalScene: mockOkScene,
    modifiedScene: {
      modified: true,
      backColor: 0x00000,
      objects: [cylinder],
      numObj: 1
    },
    solo: {first: {name: "fre", score: "300"}, second: {name: "fre", score: "300"}, third: {name: "fre", score: "300"}},
    multi: {first: {name: "fre", score: "300"}, second: {name: "fre", score: "300"}, third: {name: "fre", score: "300"}},
    differencesIndex: [],
  };

  const container1: HTMLDivElement = document.createElement("div");
  const container2: HTMLDivElement = document.createElement("div");
  const component: RenderService = new RenderService(new ShapeCreatorService());

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ RenderService, ShapeCreatorService ]
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
      expect(component["sceneOriginal"].background).toEqual(new THREE.Color(mockOkScene.backColor));
    });
    it("should call createShape the right amount of times", () => {
      spyOn(component["shapeService"], "createShape");
      component.initialize(container1, null, mockGame);
      expect(component["shapeService"].createShape).toHaveBeenCalledTimes(mockOkScene.numObj);
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
});
