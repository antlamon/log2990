import chai = require("chai");
import spies = require("chai-spies");
import { NO_MAX_OBJECTS } from "../../../common/models/game3D";
import { IObjet3D } from "../../../common/models/objet3D";
import { MODELS } from "../../../common/models/textures";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

const mockObjects: IObjet3D[] = [];
const MIN: number = 12;
const MAX: number = 20;
const NUM_TRIES: number = 5;

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("object generator service", () => {
    let service: ObjectGeneratorService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        service = container.get<ObjectGeneratorService>(TYPES.ObjectGeneratorService);
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe("Function shoud return a number in the given interval", () => {
        it("Should return a number in the interval", async () => {
            expect(service.randomInt(MIN, MAX)).to.be.greaterThan(MIN - 1).and.lessThan(MAX + 1);
        });
    });
    describe("Generating an object should be randomized", () => {
        it("Should return a valid geometric object", async () => {
            let goodtype: boolean = true;
            mockObjects.splice(0, mockObjects.length);
            for (let i: number = 0; i < NO_MAX_OBJECTS; i++) {
                mockObjects.push(service.generateRandomGeometricObject(mockObjects));
                if (mockObjects[i].texture !== undefined || mockObjects[i].color === 0) {
                    goodtype = false;
                }
            }
            expect(goodtype).to.eql(true);
        });
    });
    describe("Thematic generator should fill the object array with thematic objects", () => {
        it("Should return objects with a valid type", () => {
            mockObjects.splice(0, mockObjects.length);
            service.addThematicObjects("barrel", service["MAX_BARRELS"], mockObjects);
            let goodtype: boolean = true;
            for (const obj of mockObjects) {
                if (obj.type !== "barrel") {
                    goodtype = false;
                }
            }
            expect(goodtype).to.equal(true);
        });
    });
    describe("Generating position tests", () => {
        it("A geometric object should be in the geometric_box_lenght", () => {
            let valid: boolean = true;
            mockObjects.splice(0, mockObjects.length);
            for (let i: number = 0; i < NUM_TRIES; i++) {
                const pos: {x: number, y: number, z: number} = service.generatePosition(mockObjects, false);
                if (pos.x > service["GEOMETRIC_GAME_SIZE"] || pos.x < - service["GEOMETRIC_GAME_SIZE"] ||
                    pos.y > service["GEOMETRIC_GAME_SIZE"] || pos.y < - service["GEOMETRIC_GAME_SIZE"] ||
                    pos.x > service["GEOMETRIC_GAME_SIZE"] || pos.z < - service["GEOMETRIC_GAME_SIZE"]) {
                    valid = false;
                }
            }
            expect(valid).to.eql(true);
        });
        it("A thematic object should respect the box_lenghts", () => {
            let valid: boolean = true;
            for (let i: number = 0; i < NUM_TRIES; i++) {
                const pos: {x: number, y: number, z: number} = service.generatePosition(mockObjects, true);
                if (pos.x > service["B0X_LENGHT_POS_X"] || pos.x < service["B0X_LENGHT_NEG_X"] ||
                    pos.y !== 0 ||
                    pos.x > service["B0X_LENGHT_POS_Z"] || pos.z < service["B0X_LENGHT_NEG_Z"]) {
                    valid = false;
                }
            }
            expect(valid).to.eql(true);
        });
        it("Thematic objects should not collide with trail", () => {
            let valid: boolean = true;
            for (let i: number = 0; i < NUM_TRIES; i++) {
                const pos: {x: number, y: number, z: number} = service.generatePosition(mockObjects, true);
                if (pos.x > service["TRAIL_NEG_COORD"] && pos.x < service["TRAIL_POS_COORD"]) {
                    valid = false;
                }
            }
            expect(valid).to.eql(true);
        });
    });
    describe("randomModels tests", () => {
        it("Should return an element of MODELS", () => {
            expect(MODELS.indexOf(service.randomModels())).to.not.equal(-1);
        });
    });
});
