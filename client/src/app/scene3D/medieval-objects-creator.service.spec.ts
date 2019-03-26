import { TestBed } from "@angular/core/testing";
import * as THREE from "three";
import { MedievalObjectsCreatorService } from "./medieval-objects-creator.service";
import { IObjet3D } from "../../../../common/models/objet3D";

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
  beforeEach(() => TestBed.configureTestingModule({
    providers: [MedievalObjectsCreatorService],
  }));
  it("should be created", () => {
    service = TestBed.get(MedievalObjectsCreatorService);
    expect(service).toBeTruthy();
  });
  describe("tests for the function createMedievalScene", () => {
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
  });
});
