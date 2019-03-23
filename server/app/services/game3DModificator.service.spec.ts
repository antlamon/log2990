import chai = require("chai");
import spies = require("chai-spies");
// tslint:disable-next-line:max-line-length
import { ADD_TYPE, DELETE_TYPE, GEOMETRIC_TYPE_NAME, IDifference, MODIFICATION_TYPE, THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { IObjet3D } from "../../../common/models/objet3D";
import { TEXTURES } from "../../../common/models/textures";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { Game3DModificatorService } from "./game3DModificator.service";

const obj3D1: IObjet3D = {
    type: "string",
    texture: TEXTURES[0],
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "0",
};
const obj3D2: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "1",
};
const obj3D3: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "2",
};
const obj3D4: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "3",
};
const obj3D5: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "4",
};
const obj3D6: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "5",
};
const obj3D7: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "6",
};
const obj3D8: IObjet3D = {
    type: "string",
    color: 0,
    texture: TEXTURES[0],
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: "7",
};

const mockTypeModifAdd: {add: boolean, delete: boolean, color: boolean} = {add: true, delete: false, color: false};
const mockTypeModifDelete: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: true, color: false};
const mockTypeModifColor: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: false, color: true};

const mockObjects: IObjet3D[] = [obj3D1, obj3D2, obj3D3, obj3D4, obj3D5, obj3D6, obj3D7, obj3D8];

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
        it("Should return an array with 7 added differences objects", async () => {
            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifAdd);
            let isAllADD: boolean = true;
            newObj.forEach((diff: IDifference) => {
                if (diff.type !== ADD_TYPE) {
                    isAllADD = false;
                }
            });
            expect(isAllADD).to.equal(true);
        });
        it("Should return an array with 7 deleted differences objects", async () => {
            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifDelete);
            let isAllDEL: boolean = true;
            newObj.forEach((diff: IDifference) => {
                if (diff.type !== DELETE_TYPE) {
                    isAllDEL = false;
                }
            });
            expect(isAllDEL).to.equal(true);
        });
        it("Should return an array with 7 added differences objects that are not in the original scene position wise", async () => {
            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifAdd);
            let areNotInScene: boolean = true;
            newObj.forEach((diff: IDifference) => {
                if ((mockObjects.findIndex((obj: IObjet3D) => obj.position === (diff.object as IObjet3D).position)) !== -1) {
                    areNotInScene = false;
                }
            });
            expect(areNotInScene).to.equal(true);
        });
        it("Should return an array with 7 deleted differences objects that are in the original scene", async () => {
            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifDelete);
            let areInScene: boolean = true;
            newObj.forEach((diff: IDifference) => {
                if ((mockObjects.findIndex((obj: IObjet3D) => obj.name === diff.name)) === -1) {
                    areInScene = false;
                }
            });
            expect(areInScene).to.equal(true);
        });

        it("Should return an array with 7 geometric modified objects", async () => {

            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifColor);
            let count: number = 0;
            for (let i: number = 0; i < newObj.length; i++) {
                if (newObj[i].object !== undefined) {
                    if ((newObj[i].object as IObjet3D).color !== mockObjects[i].color) {
                        count++;
                    }
                }
            }
            expect(count).to.eql(Game3DModificatorService.NB_DIFF);
        });
        it("Should return an array with 7 geometric modified objects with type MODIF", async () => {

            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifColor);
            let count: number = 0;
            for (let i: number = 0; i < newObj.length; i++) {
                if (newObj[i].object !== undefined) {
                    if ((newObj[i].object as IObjet3D).color !== mockObjects[i].color) {
                        count++;
                    }
                }
            }
            expect(count).to.eql(Game3DModificatorService.NB_DIFF);
        });
        it("Should return an array with 7 thematic modified objects with type MODIF", async () => {
            // to modify with texture next sprint

            const newObjs: IDifference[] = service.createModifScene(mockObjects, THEMATIC_TYPE_NAME, mockTypeModifColor);
            let count: number = 0;
            for (const newObj of newObjs) {
                if (newObj.type === MODIFICATION_TYPE) {
                    if ((newObj.object as IObjet3D).texture !== mockObjects.find((obj: IObjet3D) => obj.name === newObj.name)) {
                        count++;
                    }
                }
            }
            expect(count).to.eql(Game3DModificatorService.NB_DIFF);
        });
        it("Should return an array with 7 geometric modified objects. The undmodified attributes should stay the same", async () => {

            const newObj: IDifference[] = service.createModifScene(mockObjects, GEOMETRIC_TYPE_NAME, mockTypeModifColor);
            let count: number = 0;
            for (let i: number = 0; i < newObj.length; i++) {
                const objOrig: IObjet3D | undefined = mockObjects.find((obj: IObjet3D) => obj.name === newObj[i].name);
                const objMod: IObjet3D = (newObj[i].object as IObjet3D);
                if ((objOrig as IObjet3D).color !== objMod.color) {
                    if ((objOrig as IObjet3D).position === objMod.position &&
                        (objOrig as IObjet3D).rotation === objMod.rotation &&
                        (objOrig as IObjet3D).size === objMod.size) {
                        count++;
                    }
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
