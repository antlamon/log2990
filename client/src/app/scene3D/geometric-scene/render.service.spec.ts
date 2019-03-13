import { TestBed, async,  inject  } from "@angular/core/testing";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { IScene3D } from "../../../../../common/models/game3D";
import { IObjet3D, IShape3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";

describe("renderService", () => {
  const cone: IShape3D = {
    type: "cone",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const cube: IShape3D = {
    type: "cube",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const cylinder: IShape3D = {
    type: "cylinder",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
  };
  const mockObjects: IObjet3D[] = [cone, cube, cylinder];
  const mockOkScene: IScene3D = {
    objects: mockObjects,
    backColor: 0xFF0F0F,
  };
  const container: HTMLDivElement = document.createElement("div");
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

  describe("Test for the function random", () => {
    it("should return a number between the max / min paremeters (included)", () => {
      const max: number = 200, min: number = 10;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
  });
  describe("Test for calls within the initialize function", () => {
    it("container property should be properly affected", () => {
      component.initialize(container, mockOkScene);
      expect(component["container"]).toEqual(container);
    });
    it("should give the background color given in parameters at creation", () => {
      component.initialize(container, mockOkScene);
      expect(component["scene"].background).toEqual(new THREE.Color(mockOkScene.backColor));
    });
    it("should call createShape the right amount of times", () => {
      spyOn(component["shapeService"], "createShape");
      component.initialize(container, mockOkScene);
      expect(component["shapeService"].createShape).toHaveBeenCalledTimes(mockOkScene.objects.length);
    });
  });
  describe("Test for the resize function", () => {
    it("should change the camera aspect ratio for the new one", () => {
      component.onResize();
      const width: number = component["container"].clientWidth;
      const height: number = component["container"].clientHeight;
      expect(component["camera"].aspect).toEqual(width / height);
    });
    it("should update the projection matrix", () => {
      const spyProjectionMatrix: jasmine.Spy = spyOn(component["camera"], "updateProjectionMatrix");
      component.onResize();
      expect(spyProjectionMatrix).toHaveBeenCalled();
    });
    it("should set the new size when resized", () => {
      const spyRenderer: jasmine.Spy = spyOn(component["renderer"], "setSize");
      component.onResize();
      const width: number = component["container"].clientWidth;
      const height: number = component["container"].clientHeight;
      expect(spyRenderer).toHaveBeenCalledWith(width, height);
    });
  });
});
