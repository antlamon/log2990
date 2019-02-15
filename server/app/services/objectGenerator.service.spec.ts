import chai = require("chai");
import spies = require("chai-spies");
import { container } from "../inversify.config";
import { Objet3D } from "../../../common/models/objet3D";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

const obj3D: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
}

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
            expect(service.randomInt(MIN, MAX)).to.be.greaterThan(MIN-1).and.lessThan(MAX+1);
        });
    });
    describe("Generating an object should be randomized", () => {
        it("Should return a valid object", async () => {
            expect(typeof(service.generateRandom3Dobject())).to.eql(typeof(obj3D));
        });
    });
});