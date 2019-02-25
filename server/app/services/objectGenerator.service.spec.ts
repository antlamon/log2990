import chai = require("chai");
import spies = require("chai-spies");
import { NO_MAX_OBJECTS } from "../../../common/models/game3D";
import { Objet3D } from "../../../common/models/objet3D";
import { TEXTURES } from "../../../common/models/textures";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

const mockObjects: Objet3D[] = [];
const MIN: number = 12;
const MAX: number = 20;

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
    describe("Function shoud return texture from the ones given", () => {
        it("Should return a texture from TEXTURES", async () => {
            expect(TEXTURES).to.contain(service.randomTexture());
        });
    });
    describe("Generating an object should be randomized", () => {
        it("Should return a valid geometric object", async () => {
            let goodtype: boolean = true;
            mockObjects.splice(0, mockObjects.length);
            for (let i: number = 0; i < NO_MAX_OBJECTS; i++) {
                mockObjects.push(service.generateRandomGeometricObject(mockObjects));
                if (mockObjects[i].texture !== "") {
                    goodtype = false;
                }
            }
            expect(goodtype).to.eql(true);
        });
        it("Should return a valid thematic object", async () => {
            let goodtype: boolean = true;
            mockObjects.splice(0, mockObjects.length);
            for (let i: number = 0; i < NO_MAX_OBJECTS; i++) {
                mockObjects.push(service.generateRandomThematicObject(mockObjects));
                if (mockObjects[i].texture === "") {
                    goodtype = false;
                }
            }
            expect(goodtype).to.eql(true);
        });
    });
});
