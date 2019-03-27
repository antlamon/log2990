import chai = require("chai");
import spies = require("chai-spies");
import { FORM_ERROR, TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { IScore } from "../../../common/models/top3";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { Game3DGeneratorService } from "./game3DGenerator.service";
import { Shapes } from "../../../common/models/shapes";

const mockBadGameType: IGame3DForm = {
    name: "newGame",
    objectType: "fake bad type",
    objectQty: 13,
    modifications: {add: true, delete: true, color: true},
};

const mockGeometric: IGame3DForm = {
    name: "newGame",
    objectType: GEOMETRIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true},
};
const mockThematic: IGame3DForm = {
    name: "newGame",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true},
};
const mockBadNb: IGame3DForm = {
    name: "newGame",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 3,
    modifications: {add: true, delete: true, color: true},
};
const mockBadModifs: IGame3DForm = {
    name: "newGame",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: false, delete: false, color: false},
};

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("Game3D generator service", () => {
    let service: Game3DGeneratorService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        service = container.get<Game3DGeneratorService>(TYPES.Game3DGeneratorService);
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe(" Creating a random 3D game should accept only geometric or themed game type", () => {
        it("Should throw a type error when random type is sent", async () => {

            expect(() => service.createRandom3DGame(mockBadGameType)).to.throw(TYPE_ERROR);
        });
        it("Should return random 3D geometric game", async () => {
            expect(service.createRandom3DGame(mockGeometric).isThematic).to.eql(false);
        });
        it("Should return random 3D thematic game", async () => {
            expect(service.createRandom3DGame(mockThematic).isThematic).to.eql(true);
        });
        it("Should return a game with geometric objects", async () => {
            expect(Shapes).to.include(service.createRandom3DGame(mockGeometric).originalScene[0].type);
        });
        it("Should return a game with thematic objects", async () => {
            expect(Shapes).to.not.include(service.createRandom3DGame(mockThematic).originalScene[0].type);
        });
    });
    describe("Should validate the number of objects and the modifications", () => {
        it("Should throw an error for missing modifications  ", async () => {

            expect(() => service.createRandom3DGame(mockBadModifs)).to.throw(FORM_ERROR);
        });
        it("Should throw an error for the wrong number of objects", async () => {

            expect(() => service.createRandom3DGame(mockBadNb)).to.throw(FORM_ERROR);
        });
    });
    describe("Top3Random function", () => {
        it("Should return an array of lenght 3 ", async () => {
            const top3: IScore[] = service.top3RandomOrder();
            const top3Size: number = 3;
            expect(top3.length).to.equal(top3Size);
        });
        it("Should return a sorted array, min time to max time", async () => {
            const top3: IScore[] = service.top3RandomOrder();
            expect(top3[0].score < top3[1].score && top3[1].score < top3[2].score).to.equal(true);
        });
    });
});
