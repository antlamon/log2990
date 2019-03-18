import chai = require("chai");
import spies = require("chai-spies");
import { FORM_ERROR, TYPE_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { GEOMETRIC_TYPE_NAME, IGame3D, IScene3D, THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { IShape3D } from "../../../common/models/objet3D";
import { ITop3 } from "../../../common/models/top3";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { Game3DGeneratorService } from "./game3DGenerator.service";

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

const obj3D: IShape3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
};

const mockScene: IScene3D = {
    backColor: 0x00000,
    objects: [obj3D],
};

const mock3DGame: IGame3D = {
    name: "string",
    id: "",
    originalScene: mockScene,
    modifiedScene: mockScene,
    solo: { } as ITop3,
    multi: { } as ITop3,
    differencesIndex: [],
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
            expect(typeof(service.createRandom3DGame(mockGeometric))).to.eql(typeof(mock3DGame));
        });
        it("Should return random 3D thematic game", async () => {
            expect(typeof(service.createRandom3DGame(mockThematic))).to.eql(typeof(mock3DGame));
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
});
