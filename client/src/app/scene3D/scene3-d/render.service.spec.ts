import { TestBed, async,  inject  } from "@angular/core/testing";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { IGame3D, IDifference, ADD_TYPE, DELETE_TYPE, MODIFICATION_TYPE } from "../../../../../common/models/game3D";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { ShapeCreatorService } from "./shape-creator.service";
import {} from "jasmine";
import { IScore } from "../../../../../common/models/top3";
import { GamecardComponent } from "../../gamecard/gamecard.component";
import { IndexService } from "src/app/services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { SceneGeneratorService } from "../scene-generator.service";
import { MedievalObjectsCreatorService } from "../medieval-objects-creator.service";
import { WHITE } from "src/app/global/constants";
describe("renderService", () => {
  const cone: IObjet3D = {
    type: "cone",
    color: WHITE,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "0",
  };
  const cube: IObjet3D = {
    type: "cube",
    color: WHITE,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "1",
  };
  const cylinder: IObjet3D = {
    type: "cylinder",
    color: WHITE,
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
    type: MODIFICATION_TYPE,
    object: cube,
    name: "1",
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
  const SENSITIVITY: number = 0.002;
  const container1: HTMLDivElement = document.createElement("div");
  const container2: HTMLDivElement = document.createElement("div");
  const service: RenderService = new RenderService(
    new SceneGeneratorService(new ShapeCreatorService(), new MedievalObjectsCreatorService()));

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ RenderService, ShapeCreatorService, GamecardComponent, IndexService, MedievalObjectsCreatorService ],
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
    service["differences"] = [];
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
  describe("Test the camera movement", () => {
    service["differences"] = [];
    it("Should translate on x axis", () => {
      const spy: jasmine.Spy = spyOn(service["camera"], "translateX").and.callFake(() => {});
      const move: number = 5;
      service.moveCam("X", move);
      expect(spy).toHaveBeenCalledWith(move);
    });
    it("Should translate on z axis", () => {
      const spy: jasmine.Spy = spyOn(service["camera"], "translateZ").and.callFake(() => {});
      const move: number = 5;
      service.moveCam("Z", move);
      expect(spy).toHaveBeenCalledWith(move);
    });
    it("Should rotate on x axis", () => {
      const move: number = 5;
      service.rotateCam("X", move);
      expect(service["camera"]["rotation"]["x"]).toEqual(-move * SENSITIVITY);
    });
    it("Should rotate on y axis", () => {
      const move: number = 5;
      service.rotateCam("Y", move);
      expect(service["camera"]["rotation"]["y"]).toEqual(- move * SENSITIVITY);
    });
  });
  describe("Rendering tests", () => {
    service["differences"] = [];
    it("Should start the rendering", () => {
      const spy: jasmine.Spy = spyOn(service["rendererO"], "render");
      service.startRenderingLoop();
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("Identifying differences tests", () => {
    service["differences"] = [];
    it("Should return null if no object is found", async () => {
      spyOn(service["sceneModif"], "getObjectByName").and.returnValue(new THREE.Object3D());
      spyOn(service["sceneOriginal"], "getObjectByName").and.returnValue(new THREE.Object3D());
      expect(service.identifyDiff(new MouseEvent("click", { clientX: 200,
                                                            clientY: service["containerOriginal"]["offsetLeft"] - 1 }))).toEqual(null);
    });
  });
  describe("Removing differences tests", () => {
    service["differences"] = [];
    it("Should need a valid type", () => {
      expect(service.removeDiff("1", "tre")).toBeUndefined();
    });
    it("Should remove an object added", async () => {
      await service.initialize(container1, container2, mockGame);
      const spy: jasmine.Spy = spyOn(service["sceneModif"], "remove");
      service.removeDiff("3", ADD_TYPE);
      expect(spy).toHaveBeenCalledWith(service["sceneModif"].getObjectByName("3"));
    });
    it("Should add a removed object", async () => {
      const spy: jasmine.Spy = spyOn(service["sceneModif"], "getObjectByName").and.returnValue(new THREE.Mesh());
      service.removeDiff("1", DELETE_TYPE);
      expect(spy).toHaveBeenCalledWith("1");
    });
    it("Should modify the material of the modified object", async () => {
      const mockMesh: THREE.Mesh = new THREE.Mesh();
      mockMesh.material = new THREE.MeshPhongMaterial();
      spyOn(service["sceneModif"], "getObjectByName").and.returnValue(mockMesh);
      const spy: jasmine.Spy = spyOn(service["sceneOriginal"], "getObjectByName").and.returnValue(mockMesh);
      service.removeDiff("1", MODIFICATION_TYPE);
      expect(spy).toHaveBeenCalledWith("1");
    });
  });
  describe("Start and stop of cheat mode tests", () => {
    service["differences"] = [];
    it("Should start the timer when starting", () => {
      service.startCheatMode();
      expect(service["timeOutDiff"]).toBeDefined();
    });
  });
  describe("Getting image test", () => {
    service["differences"] = [];
    it("Should return an image URL as string", () => {
      const spy: jasmine.Spy = spyOn(service["sceneGenerator"], "createScene").and.callFake(async () => Promise.resolve(new THREE.Scene()));
      service.getImageURL(mockGame);
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("adding listener test", () => {
    service["differences"] = [];
    it("Should add event listeners to the renderers", () => {
      service.addListener("mousemove", () => { return; });
      expect(service["rendererO"]["domElement"]["onmousemove"]).toBeDefined();
    });
  });
});
