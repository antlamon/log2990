import { TestBed } from "@angular/core/testing";
import { SceneGeneratorService } from "./scene-generator.service";
import { IDifference, ADD_TYPE, DELETE_TYPE, MODIFICATION_TYPE } from "../../../../common/models/game3D";
import { IObjet3D } from "../../../../common/models/objet3D";
import { ShapeCreatorService } from "./scene3-d/shape-creator.service";
import * as THREE from "three";
import { MedievalObjectsCreatorService } from "./medieval-objects-creator.service";
const cone: IObjet3D = {
  type: "cone",
  color: 1,
  texture: "",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
  name: "0",
};
const cube: IObjet3D = {
  type: "cube",
  color: 1,
  texture: "",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
  name: "1",
};
const cubeM: IObjet3D = {
  type: "cube",
  color: 2,
  texture: "diff",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
  name: "1",
};
const cylinder: IObjet3D = {
  type: "cylinder",
  color: 1,
  texture: "",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
  name: "2",
};
const cylinderNotTouched: IObjet3D = {
  type: "cylinder",
  color: 1,
  texture: "",
  position: { x: 0, y: 0, z: 0},
  size: 0.7,
  rotation: {x: 0, y: 0, z: 0},
  name: "3",
};
const mockObjects: IObjet3D[] = [cone, cube, cylinder, cylinderNotTouched];

const differences: IDifference[] = [
  {
  type: ADD_TYPE,
  object: cone,
  name: "4",
 },
  {
  type: DELETE_TYPE,
  object: cube,
  name: "0",
 },
  {
  type: MODIFICATION_TYPE,
  object: cubeM,
  name: "1",
 }
];
let service: SceneGeneratorService = new SceneGeneratorService(new ShapeCreatorService(), new MedievalObjectsCreatorService());
describe("SceneGeneratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ShapeCreatorService, SceneGeneratorService, MedievalObjectsCreatorService],
  }));

  it("should be created", () => {
    service = TestBed.get(SceneGeneratorService);
    expect(service).toBeTruthy();
    spyOn(service["shapeService"], "createShape").and.callFake((obj: IObjet3D): Promise<THREE.Mesh> => {
      const mockMesh: THREE.Mesh = new THREE.Mesh();
      mockMesh.name = obj.name;
      mockMesh.material = new THREE.MeshPhongMaterial({shininess: obj.color});

      return Promise.resolve(mockMesh);
    });
    spyOn(service["modelsService"], "createMedievalScene").and.callFake(async (obj: IObjet3D[]): Promise<THREE.Mesh[]> => {
      return [];
    });
  });
  describe("Test the function createScene", async () => {
    it("The returned THREE.Scene should have the correct background color which was passed has a parameter", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      expect(scene.background).toEqual(new THREE.Color(1));
    });
    it("The returned THREE.Scene should have the correct number of Mesh added in it plus two for the lights", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      // tslint:disable-next-line:no-magic-numbers
      expect(scene.children.length).toEqual(mockObjects.length + 2);
    });
  });
  describe("Test the function modifyScene", async () => {
    it("The returned THREE.Scene should have the same background colors", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false , differences);
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), differences);
      expect(scene.background).toEqual(sceneM.background);
    });
    it("The returned modify scene should have more objects when a ADD_TYPE difference is passed to the function (geometric)", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), differences);
      expect(scene.children.length + 1).toEqual(sceneM.children.length);
    });
    it("The returned modify scene should have more objects when a ADD_TYPE difference is passed to the function (thematic)", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, true, differences);
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), differences);
      expect(scene.children.length + 1).toEqual(sceneM.children.length);
    });
    it("The returned THREE.Scene should have and element which is invisible when a difference of type DELETE is passed", async () => {
      const sceneM: THREE.Scene  = await service.modifyScene((
        await service.createScene(mockObjects, 1, false, differences)).clone(),
                                                             differences);
      let nbNotVisible: number = 0;
      sceneM.children.forEach((obj: THREE.Object3D) => {
        if ( obj.visible === false) {
          nbNotVisible++;
        }
      });
      expect(nbNotVisible).toEqual(1);
    });
    it("The returned THREE.Scene should have and element which the material is different from the original scene", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), differences);
      expect(scene.getObjectByName("1") as THREE.Mesh).not.toEqual(sceneM.getObjectByName("1") as THREE.Mesh);
    });
    it("All objects untouched by the differences should stay the same", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), differences);
      let areTheSames: boolean = true;
      sceneM.children.forEach((obj: THREE.Object3D) => {
        if ( differences.findIndex((diff: IDifference) => diff.name === obj.name) === -1) {
          if ((obj as THREE.Mesh).material !== (scene.getObjectByName(obj.name) as THREE.Mesh).material
          || obj.visible !==  scene.getObjectByName(obj.name).visible) {
            areTheSames = false;
          }
        }
      });
      expect(areTheSames).toEqual(true);
    });
  });
});
