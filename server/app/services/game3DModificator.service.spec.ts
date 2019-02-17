import chai = require("chai");
import spies = require("chai-spies");
import { container } from "../inversify.config";
import { Objet3D } from "../../../common/models/objet3D";
import { TYPES } from "../types";
import { Game3DModificatorService } from "./game3DModificator.service";

const obj3D1: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D2: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D3: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D4: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D5: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D6: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D7: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}
const obj3D8: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}

const typeGeometric: string = "geometric";
const typeTexture: string = "themed";

const mockTypeModifAdd: {add: boolean, delete: boolean, color: boolean} = {add: true, delete: false, color: false};
const mockTypeModifDelete: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: true, color: false};
const mockTypeModifColor: {add: boolean, delete: boolean, color: boolean} = {add: false, delete: false, color: true};

const mockObjects: Objet3D[] = [obj3D1, obj3D2, obj3D3, obj3D4, obj3D5,obj3D6, obj3D7, obj3D8];


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

    describe("Modifying the objects should work, whatever the type", () => {
        it("Should return an array with 7 added objects", async () => {
            expect(service.createModifScene(mockObjects, typeGeometric, mockTypeModifAdd).length).to.eql(mockObjects.length+7);
        });
        
        it("Should return an array with only 1 object", async () => {

            expect(service.createModifScene(mockObjects, typeGeometric, mockTypeModifDelete).length).to.eql(mockObjects.length-7);
        });

        it("Should return an array with 7 modified objects", async () => {

            const newObj: Objet3D[] = service.createModifScene(mockObjects, typeGeometric, mockTypeModifColor);
            let count: number = 0;
            for(let i: number = 0; i < mockObjects.length; i++) {
                if (newObj[i].color !== mockObjects[i].color) {
                    count++;
                }
            }
            expect(count).to.eql(7);
        });
        it("Should return an array with 7 modified objects", async () => {
            //A modifier avec les textures
            const newObj: Objet3D[] = service.createModifScene(mockObjects, typeTexture, mockTypeModifColor);
            let count: number = 0;
            for(let i: number = 0; i < mockObjects.length; i++) {
                if (newObj[i].color !== mockObjects[i].color) {
                    count++;
                }
            }
            expect(count).to.eql(7);
        });

    });
});