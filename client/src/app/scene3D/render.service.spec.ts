// tslint:disable:max-file-line-count
import { TestBed, async,  inject  } from "@angular/core/testing";
import * as THREE from "three";
import { RenderService } from "./render.service";
import { IGame3D, IDifference, ADD_TYPE, DELETE_TYPE, MODIFICATION_TYPE } from "../../../../common/models/game3D";
import { IObjet3D } from "../../../../common/models/objet3D";
import { ShapeCreatorService } from "./geometric/shape-creator.service";
import {} from "jasmine";
import { IScore } from "../../../../common/models/top3";
import { GamecardComponent } from "../gamecard/gamecard.component";
import { IndexService } from "src/app/services/index.service";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { SceneGeneratorService } from "./scene-generator.service";
import { MedievalObjectsCreatorService } from "./thematic/medieval-objects-creator.service";
import { WHITE, AXIS, SQUARE_BOX_LENGHT, SKY_BOX_DEPTH } from "src/app/global/constants";
import { THREE_ERROR } from "../../../../common/models/errors";

describe("renderService", () => {
  const cone: IObjet3D = {
    type: "cone",
    color: WHITE,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "0",
  };
  const cube: IObjet3D = {
    type: "cube",
    color: WHITE,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "1",
  };
  const cylinder: IObjet3D = {
    type: "cylinder",
    color: WHITE,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "2",
  };
  const themeObj: IObjet3D = {
    type: "tree1",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "0",
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
  const themeDiff: IDifference = {
    type: MODIFICATION_TYPE,
    object: themeObj,
    name: "0",
  };
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
  const mockThematic: IGame3D = {
    name: "mockTheme",
    id: "2",
    originalScene: [themeObj],
    solo: [] as IScore[],
    multi: [] as IScore[],
    differences: [themeDiff],
    isThematic: true,
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
      imports: [HttpClientModule, HttpClientTestingModule]
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
      // tslint:disable-next-line:no-any
      spyOn(service as any, "getObject").and.returnValue(new THREE.Object3D());
      await service.initialize(container1, container2, mockGame);
      expect(service["containerOriginal"]).toEqual(container1);
    });
    it("should give the background color given in parameters at creation", async () => {
      // tslint:disable-next-line:no-any
      spyOn(service as any, "getObject").and.returnValue(new THREE.Object3D());
      await service.initialize(container1, container2, mockGame);
      expect(service["sceneOriginal"].background).toEqual(new THREE.Color(mockGame.backColor));
    });
    it("giving a thematic game should also properly affect the container", async () => {
      await service.initialize(container1, container2, mockThematic);
      expect(service["containerOriginal"]).toEqual(container1);
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
      // tslint:disable-next-line:no-any
      spyOn(service as any, "getObject").and.returnValue(new THREE.Object3D());
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
      // tslint:disable-next-line:no-any
      spyOn(service as any, "detectCollision").and.callFake(() => {});
      const move: number = 5;
      service.moveCam(AXIS.X, move);
      expect(spy).toHaveBeenCalledWith(move);
    });
    it("Should translate on z axis", () => {
      const spy: jasmine.Spy = spyOn(service["camera"], "translateZ").and.callFake(() => {});
      // tslint:disable-next-line:no-any
      spyOn(service as any, "detectCollision").and.callFake(() => {});
      const move: number = 5;
      service.moveCam(AXIS.Z, move);
      expect(spy).toHaveBeenCalledWith(move);
    });
    it("Should rotate on x axis", () => {
      const move: number = 5;
      service.rotateCam(AXIS.X, move);
      expect(service["camera"]["rotation"]["x"]).toEqual(-move * SENSITIVITY);
    });
    it("Should rotate on y axis", () => {
      const move: number = 5;
      service.rotateCam(AXIS.Y, move);
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
      service["differencesObjects"] = [];
      expect(service.identifyDiff(new MouseEvent("click", { clientX: 200,
                                                            clientY: service["containerOriginal"]["offsetLeft"] - 1 }))).toEqual(null);
    });
    it("Should return an object if found", async () => {
      const mockCube: THREE.Object3D = await service["sceneGenerator"]["shapeService"].createShape(cube);
      const mockChild: THREE.Object3D = mockCube.clone();
      mockChild.name = "hi";
      mockCube.add(mockChild);
      const pos: THREE.Vector3 = new THREE.Vector3(0, 0, 0);
      spyOn(service["sceneModif"], "getObjectByName").and.returnValue(mockCube);
      spyOn(service["sceneOriginal"], "getObjectByName").and.returnValue(mockCube);
      service["differencesObjects"] = [];
      spyOn(service["raycaster"], "intersectObjects").and.returnValue([{distance: 1, point: pos, object: mockChild}]);
      const result: THREE.Object3D | null = service.identifyDiff(new MouseEvent("mouseup", { clientX: 0,
                                                                                             clientY: 0}));
      expect(result).toEqual(mockCube);
    });
  });
  describe("Removing differences tests", () => {
    it("Should need a valid type", () => {
      service["differencesObjects"] = [];
      expect(service.removeDiff("1", "tre")).toBeUndefined();
    });
    it("Should remove an object added", async () => {
      service["differencesObjects"] = [];
      service["sceneModif"] = new THREE.Scene();
      const tempObj: THREE.Mesh = new THREE.Mesh();
      tempObj.name = "3";
      service["sceneModif"].add(tempObj);
      const spy: jasmine.Spy = spyOn(service["sceneModif"], "remove");
      service.removeDiff("3", ADD_TYPE);
      expect(spy).toHaveBeenCalledWith(service["sceneModif"].getObjectByName("3"));
    });
    it("Should add a removed object", async () => {
      service["differencesObjects"] = [];
      const spy: jasmine.Spy = spyOn(service["sceneModif"], "getObjectByName").and.returnValue(new THREE.Mesh());
      service.removeDiff("1", DELETE_TYPE);
      expect(spy).toHaveBeenCalledWith("1");
    });
    it("Should modify the material of the modified object", async () => {
      service["differencesObjects"] = [];
      const mockMesh: THREE.Mesh = new THREE.Mesh();
      mockMesh.material = new THREE.MeshPhongMaterial();
      spyOn(service["sceneModif"], "getObjectByName").and.returnValue(mockMesh);
      const spy: jasmine.Spy = spyOn(service["sceneOriginal"], "getObjectByName").and.returnValue(mockMesh);
      service.removeDiff("1", MODIFICATION_TYPE);
      expect(spy).toHaveBeenCalledWith("1");
    });
    it("Should modify the texture of the modified object", async () => {
      service["differencesObjects"] = [];
      service["isThematic"] = true;
      const mockMesh: THREE.Mesh = new THREE.Mesh();
      mockMesh.material = new THREE.MeshPhongMaterial();
      spyOn(service["sceneModif"], "getObjectByName").and.returnValue(mockMesh);
      const spy: jasmine.Spy = spyOn(service["sceneOriginal"], "getObjectByName").and.returnValue(mockMesh);
      service.removeDiff("0", MODIFICATION_TYPE);
      expect(spy).toHaveBeenCalledWith("0");
    });
  });
  describe("Start and stop of cheat mode tests", () => {
    service["differencesObjects"] = [];
    it("Should start the timer when starting", () => {
      service.startCheatMode();
      expect(service["timeOutDiff"]).toBeDefined();
    });
    it("Should make all differencesObjects visible when stopping", () => {
      service.stopCheatMode();
      expect(service["diffAreVisible"]).toBe(true);
    });
  });
  describe("Getting image test", () => {
    service["differencesObjects"] = [];
    it("Should return an image URL as string", () => {
      const spy: jasmine.Spy = spyOn(service["sceneGenerator"], "createScene").and.callFake(async () => Promise.resolve(new THREE.Scene()));
      service.getImageURL(mockGame).catch(() => {
        throw new THREE_ERROR("error while rendering a scene");
      });
      expect(spy).toHaveBeenCalled();
    });
  });
  describe("adding listener test", () => {
    service["differencesObjects"] = [];
    it("Should add event listeners to the renderers", () => {
      service.addListener("mousemove", () => { return; });
      expect(service["rendererO"]["domElement"]["onmousemove"]).toBeDefined();
    });
  });
  describe("Test for collisons", () => {
    it("The function moveCam should call the function detectCollision", () => {
      // tslint:disable-next-line:no-any
      spyOn(service as any, "detectOutOfBox").and.returnValue(false);
      service["differencesObjects"] = [];
      service["hitboxes"] = [];
      service["camera"] = new THREE.PerspectiveCamera();
      // tslint:disable-next-line:no-any
      const spy: jasmine.Spy = spyOn((service as any), "detectCollision");
      service.moveCam(AXIS.X, 1);
      service.moveCam(AXIS.Z, 1);
      // tslint:disable-next-line:no-magic-numbers
      expect(spy).toHaveBeenCalledTimes(2);
    });
    it("If the camera is inside a hitboxe, the function move came should be called at least once with a inverse mouvement", () => {
      // tslint:disable-next-line:no-any
      spyOn(service as any, "detectOutOfBox").and.returnValue(false);
      service["differencesObjects"] = [];
      service["hitboxes"] = [["mockHitbox", new THREE.Box3(new THREE.Vector3(-1, -1, -1), new THREE.Vector3(1, 1, 1))]];
      service["camera"] = new THREE.PerspectiveCamera();
      service["camera"].position.set(-1, 0, 0);
      const spyX: jasmine.Spy = spyOn(service["camera"], "translateX").and.callThrough();
      const spyZ: jasmine.Spy = spyOn(service["camera"], "translateZ").and.callThrough();
      const mouvement: number = 1;
      service.moveCam(AXIS.X, mouvement);
      expect(spyX).toHaveBeenCalledWith(-mouvement);
      service["camera"].position.set(0, 0, -1);
      service.moveCam(AXIS.Z, mouvement);
      expect(spyZ).toHaveBeenCalledWith(-mouvement);
    });
  });
  describe("Tests for out of box", () => {
    it("The function moveCam should call the function detectOutOfBox", () => {
      service["differencesObjects"] = [];
      service["hitboxes"] = [];
      service["camera"] = new THREE.PerspectiveCamera();
      // tslint:disable-next-line:no-any
      const spy: jasmine.Spy = spyOn((service as any), "detectOutOfBox");
      service.moveCam(AXIS.X, 1);
      service.moveCam(AXIS.Z, 1);
      // tslint:disable-next-line:no-magic-numbers
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it("Should call the fucntion move to be call with the opposite mouvement when getting out of box geometric", () => {

      service["differencesObjects"] = [];
      service["hitboxes"] = [];
      service["isThematic"] = false;
      service["camera"] = new THREE.PerspectiveCamera();
      service["camera"].translateX(SQUARE_BOX_LENGHT);
      const spy: jasmine.Spy = spyOn(service["camera"], "translateX").and.callThrough();
      const mouvement: number = 1;
      service.moveCam(AXIS.X, mouvement);
      expect(spy).toHaveBeenCalledWith(-mouvement);
    });
    it("Should call the fucntion move to be call with the opposite mouvement when getting out of box thematic", () => {
      service["differencesObjects"] = [];
      service["hitboxes"] = [];
      service["isThematic"] = true;
      service["camera"] = new THREE.PerspectiveCamera();
      service["camera"].position.set(0, 1, SKY_BOX_DEPTH);
      const spy: jasmine.Spy = spyOn(service["camera"], "translateZ").and.callThrough();
      const mouvement: number = 1;
      service.moveCam(AXIS.Z, mouvement);
      expect(spy).toHaveBeenCalledWith(-mouvement);
    });
  });
});
