import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { MedievalObjectsCreatorService } from "./medieval-objects-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { IDifference, ADD_TYPE } from "../../../../../common/models/game3D";

describe("MedievalObjectsCreatorService", () => {
  let service: MedievalObjectsCreatorService = new MedievalObjectsCreatorService();
  let mockObjs: IObjet3D[] = [];
  const mockObj: IObjet3D = {
    type: "dragon",
    position: { x: 0, y: 0, z: 0 },
    size: 1,
    rotation: { x: 0, y: 0, z: 0 },
    name: "1",
  };
  const mockDragon: IObjet3D = {
    type: "dragon",
    position: { x: 0, y: 0, z: 0 },
    size: 1,
    rotation: { x: 0, y: 0, z: 0 },
    name: "1",
  };
  const mockCastle: IObjet3D = {
    type: "castleWorld",
    position: { x: 0, y: 0, z: 0 },
    size: 1,
    rotation: { x: 0, y: 0, z: 0 },
    name: "1",
  };
  const mockKnight: IObjet3D = {
    type: "knight",
    position: { x: 0, y: 0, z: 0 },
    size: 1,
    rotation: { x: 0, y: 0, z: 0 },
    name: "1",
  };
  beforeEach(() => TestBed.configureTestingModule({
    providers: [MedievalObjectsCreatorService],
  }));
  it("should be created", () => {
    service = TestBed.get(MedievalObjectsCreatorService);
    expect(service).toBeTruthy();
  });
  describe("function createMedievalScene", async () => {
    describe("The returned THREE.Mesh[] should have the correct number of Mesh added in it plus two for castle and the skybox ", () => {
      it("should return an array of lenght 2 when called with an empty IObjet3D array", async () => {
        const mockMeshs: THREE.Mesh[] = await service.createMedievalScene(mockObjs, []);
        const sizeGiven: number = mockMeshs.length;
        const sizeExpected: number = 2;
        expect(sizeGiven).toEqual(sizeExpected);
      });
      it("should return an array of lenght 5 when called with an IObjet3D array of size 3", async () => {
        mockObjs = [];
        const objQty: number = 3;
        for (let i: number = 0; i < objQty; i++) {
          mockObjs.push(mockObj);
        }
        const mockMeshs: THREE.Mesh[] = await service.createMedievalScene(mockObjs, []);
        const sizeGiven: number = mockMeshs.length;
        const sizeExpected: number = 5;
        expect(sizeGiven).toEqual(sizeExpected);
      });
      it("should return an array of lenght 12 when called with an IObjet3D array of size 10", async () => {
        mockObjs = [];
        const objQty: number = 10;
        for (let i: number = 0; i < objQty; i++) {
          mockObjs.push(mockObj);
        }
        const mockMeshs: THREE.Mesh[] = await service.createMedievalScene(mockObjs, []);
        const sizeGiven: number = mockMeshs.length;
        const sizeExpected: number = 12;
        expect(sizeGiven).toEqual(sizeExpected);
      });
    });
    describe("The loadedObject Array should cache the objects already loaded, except for the difference object", async () => {
      it("loadedObject should contain a dragon Mesh after createScene has been called with a dragon in objects[]", async () => {
        mockObjs = [mockDragon];
        await service.createMedievalScene(mockObjs, []);
        expect(service["loadedModels"].get("dragon")).toBeDefined();
      });
      it("loadedObject should contain a knight Mesh after createScene has been called with a knight in objects[]", async () => {
        mockObjs = [mockKnight];
        await service.createMedievalScene(mockObjs, []);
        expect(service["loadedModels"].get("knight")).toBeDefined();
      });
      it("loadedObject should contain a castle Mesh after createScene has been called with a castle in objects[]", async () => {
        mockObjs = [mockCastle];
        await service.createMedievalScene(mockObjs, []);
        expect(service["loadedModels"].get("castleWorld")).toBeDefined();
      });
      it("should not add a mesh to the loadedModels if it has the same name as a differences' object", async () => {
        mockObjs = [mockDragon];
        const name: string = "1";
        mockObjs[0].name = name;
        const mockDiffs: IDifference[] = [{
          type: ADD_TYPE,
          name: name,
        }];
        service["loadedModels"] = new Map();
        await service.createMedievalScene(mockObjs, mockDiffs);
        expect(service["loadedModels"].get("dragon")).toBeUndefined();
      });
    });
  });
});
