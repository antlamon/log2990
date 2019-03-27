import { TestBed } from "@angular/core/testing";
import { SceneGeneratorService } from "./scene-generator.service";
import { IDifference, ADD_TYPE, DELETE_TYPE, MODIFICATION_TYPE } from "../../../../common/models/game3D";
import { IObjet3D } from "../../../../common/models/objet3D";
import { ShapeCreatorService } from "./geometric/shape-creator.service";
import * as THREE from "three";
import { MedievalObjectsCreatorService } from "./thematic/medieval-objects-creator.service";
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
const mockDragon: IObjet3D = {
  name: "1",
  type: "dragon",
  position: { x: 0, y: 0, z: 0},
  size: 1,
  rotation: {x: 0, y: 0, z: 0},
};
const diffDragon: IDifference[] = [
  {
    type: MODIFICATION_TYPE,
    object: mockDragon,
    name: mockDragon.name,
    }
];
let service: SceneGeneratorService = new SceneGeneratorService(new ShapeCreatorService(), new MedievalObjectsCreatorService());
describe("SceneGeneratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [ShapeCreatorService, SceneGeneratorService, MedievalObjectsCreatorService],
  }));

  it("should be created", async () => {
    service = TestBed.get(SceneGeneratorService);
    expect(service).toBeTruthy();
    spyOn(service["shapeService"], "createShape").and.callFake( async (obj: IObjet3D): Promise<THREE.Mesh> => {
      const mockMesh: THREE.Mesh = new THREE.Mesh();
      mockMesh.name = obj.name;
      mockMesh.material = new THREE.MeshPhongMaterial({shininess: obj.color});

      return Promise.resolve(mockMesh);
    });
  });
  describe("Test the function createScene", async () => {
    it("The returned THREE.Scene should have the correct background color which was passed has a parameter", async () => {
      spyOn(service["modelsService"], "createMedievalScene").and.callFake(async (): Promise<THREE.Mesh[]> => {
        return [];
      });
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, true, differences);
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
      const scene: THREE.Scene  = new THREE.Scene();
      scene.background = new THREE.Color(0);
      const sceneM: THREE.Scene  = service.modifyScene(scene.clone(), []);
      expect(scene.background).toEqual(sceneM.background as THREE.Color);
    });
    it("The returned modify scene should have more objects when a ADD_TYPE difference is passed to the function (geometric)", async () => {
      const scene: THREE.Scene  = new THREE.Scene();
      service["isThematic"] = true;
      spyOn(service["modelsService"], "createObject").and.callFake(async (): Promise<THREE.Mesh> => {
        return new THREE.Mesh();
      });
      // tslint:disable-next-line: await-promise
      const sceneM: THREE.Scene  = await service.modifyScene(scene.clone(), [{type: ADD_TYPE, object: mockDragon, name: "1"}]);
      expect(scene.children.length + 1).toEqual(sceneM.children.length);
    });
    it("The returned THREE.Scene should have and element which is invisible when a difference of type DELETE is passed", async () => {
      spyOn(service["modelsService"], "createMedievalScene").and.callFake(async (): Promise<THREE.Mesh[]> => {
        const tempMesh: THREE.Mesh = new THREE.Mesh();
        tempMesh.name = "0";

        return [tempMesh];
      });
      const sceneM: THREE.Scene  = service.modifyScene((
        await service.createScene([], 1, true, [])).clone(),
                                                       [{type: DELETE_TYPE, name: "0"}]);
      let nbNotVisible: number = 0;
      sceneM.children.forEach((obj: THREE.Object3D) => {
        if ( !obj.visible) {
          nbNotVisible++;
        }
      });
      expect(nbNotVisible).toEqual(1);
    });
    it("The returned THREE.Scene should have and element which the material is different from the original scene (geometric)", async () => {
      spyOn(service["modelsService"], "createMedievalScene").and.callFake(async (): Promise<THREE.Mesh[]> => {
        const tempMesh: THREE.Mesh = new THREE.Mesh();
        tempMesh.name = "0";

        return [tempMesh];
      });
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, true, []);
      const sceneM: THREE.Scene  = service.modifyScene(scene.clone(),   [{
        type: MODIFICATION_TYPE,
        object: cubeM,
        name: "0",
       }]);
      expect(scene.getObjectByName("1") as THREE.Mesh).not.toEqual(sceneM.getObjectByName("0") as THREE.Mesh);
    });
    it("The returned THREE.Scene should have and element which the material is different from the original scene (thematic)", async () => {
      spyOn(service, "createScene").and.callFake(async (): Promise<THREE.Scene> => {
        return new THREE.Scene();
      });
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, true, diffDragon);
      scene.add(await service["modelsService"].createObject(mockDragon, true));
      let sceneM: THREE.Scene  = await service.createScene(mockObjects, 1, true, diffDragon);
      sceneM.add(await service["modelsService"].createObject(mockDragon, true));
      sceneM = service.modifyScene(sceneM, diffDragon);
      expect(scene.getObjectByName(mockDragon.name) as THREE.Mesh).not.toEqual(sceneM.getObjectByName(mockDragon.name) as THREE.Mesh);
    });
    it("All objects untouched by the differences should stay the same", async () => {
      const scene: THREE.Scene  = await service.createScene(mockObjects, 1, false, differences);
      const sceneM: THREE.Scene  = service.modifyScene(scene.clone(), differences);
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
