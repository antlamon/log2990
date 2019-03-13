import chai = require("chai");
import spies = require("chai-spies");
import { GEOMETRIC_TYPE_NAME, IScene3D } from "../../../common/models/game3D";
import { IShape3D } from "../../../common/models/objet3D";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { Game3DModificatorService } from "./game3DModificator.service";

const obj3D1: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D2: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D3: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D4: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D5: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D6: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D7: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};
const obj3D8: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};

const mockTypeModifAdd: {add: boolean, delete: boolean, color: boolean} = {add: true, delete: false, color: false};
const mockTypeModifDelete: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: true, color: false};
const mockTypeModifColor: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: false, color: true};

const mockObjects: IShape3D[] = [obj3D1, obj3D2, obj3D3, obj3D4, obj3D5, obj3D6, obj3D7, obj3D8];

const mockScene: IScene3D = {
    backColor: 0x0000,
    objects: mockObjects,
};

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("Game3D Modificator service", () => {
    let service: Game3DModificatorService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        service = container.get<Game3DModificatorService>(TYPES.Game3DModificatorService);
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe("Modifying the objects should work, whatever the type, if there is modifications", () => {
        it("Should return an array with 7 added objects", async () => {
            expect(service.createModifScene(mockScene, GEOMETRIC_TYPE_NAME, mockTypeModifAdd).objects.length).
                to.eql(mockObjects.length + Game3DModificatorService.NB_DIFF);
        });

        it("Should return an array with only 1 object", async () => {

            expect(service.createModifScene(mockScene, GEOMETRIC_TYPE_NAME, mockTypeModifDelete).objects.length).
                to.eql(mockObjects.length - Game3DModificatorService.NB_DIFF);
        });

        it("Should return an array with 7 geometric modified objects", async () => {

            const newObj: IScene3D = service.createModifScene(mockScene, GEOMETRIC_TYPE_NAME, mockTypeModifColor);
            let count: number = 0;
            for (let i: number = 0; i < mockObjects.length; i++) {
                if (((newObj.objects[i]) as IShape3D).color !== mockObjects[i].color) {
                    count++;
                }
            }
            expect(count).to.eql(Game3DModificatorService.NB_DIFF);
        });

    });
    describe("Should test the contrast to notice difference", () => {
        it("Should return false, not enough constrast", async () => {
            expect(service.isEnoughContrast(0x000000, 0x000001)).to.eql(false);
        });
        it("Should return true, enough contrast", async () => {
            const color: number = 0x00FF00;
            expect(service.isEnoughContrast(color, 0x000001)).to.eql(true);
        });
    });
});
