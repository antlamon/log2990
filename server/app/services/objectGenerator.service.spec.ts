import chai = require("chai");
import spies = require("chai-spies");
import { NO_MAX_OBJECTS } from "../../../common/models/game3D";
import { IObjet3D } from "../../../common/models/objet3D";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

const obj3D: IObjet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};

const mockObjects: IObjet3D[] = [obj3D];
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
    describe("Generating an object should be randomized", () => {
        it("Should return a valid object", async () => {
            let goodtype: boolean = true;
            for (let i: number = 0; i < NO_MAX_OBJECTS; i++) {
                mockObjects.push(service.generateRandom3Dobject(mockObjects));
                if (typeof(mockObjects[i]) !== typeof(obj3D)) {
                    goodtype = false;
                }
            }
            expect(goodtype).to.eql(true);
        });
    });
});
