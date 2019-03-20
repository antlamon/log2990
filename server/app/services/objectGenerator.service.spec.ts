import chai = require("chai");
import spies = require("chai-spies");
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { ObjectGeneratorService } from "./objectGenerator.service";

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
});
