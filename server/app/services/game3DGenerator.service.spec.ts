import chai = require("chai");
import spies = require("chai-spies");
import { IGame3DForm } from "../../../common/models/game";
import { container } from "../inversify.config";
import { Objet3D } from "../../../common/models/objet3D";
import { TYPES } from "../types";
import { Game3D, Scene3D, THEMATIC_TYPE_NAME, GEOMETRIC_TYPE_NAME } from "../../../common/models/game3D";
import { Game3DGeneratorService } from "./game3Dgenerator.service";

const TYPE_ERROR: Error = {
    name: "Invalid game3D type: ",
    message: "The type chosen for the new 3D game is not valid."
};

const mockBadGameType: IGame3DForm = {
    name: "heres my new game",
    objectType: "fake bad type",
    objectQty: 13,
    modifications: {add: true, delete: true, color: true} 
};

const mockGeometric: IGame3DForm = {
    name: "heres my new game",
    objectType: GEOMETRIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true} 
};
const mockThematic: IGame3DForm = {
    name: "heres my new game",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true} 
};
const mockBadNb: IGame3DForm = {
    name: "heres my new game",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true} 
};
const mockBadModifs: IGame3DForm = {
    name: "heres my new game",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: true, delete: true, color: true} 
};

const obj3D: Objet3D = {
    type: "string",
    color: 0,
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0}
};

const mockScene: Scene3D = {
    modified: false,
    backColor: 0x00000,
    objects: [obj3D],
    numObj: 1
};

const mock3DGame: Game3D = {
    name: "string",
    id: 0,
    originalScene: mockScene,
    modifiedScene: mockScene,  
    solo: {first:222, second: 223, third: 21312},
    multi: {first:222, second: 223, third: 21312}
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
            try {
                service.createRandom3DGame(mockBadGameType);
            } catch(error) {
                expect(error.message).to.eql(TYPE_ERROR.message);
            }
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
            try{
                service.createRandom3DGame(mockBadModifs);
            }   catch(error) {
                expect(error.message).to.eql("Il faut choisir au moins une modification");
            }
        });
        it("Should throw an error for the wrong number of objects", async () => {
            try {
                service.createRandom3DGame(mockBadNb);
            } catch (error) {
                expect(error.message).to.eql("Le nombre d'objets doit être entre 10 et 200");
            }
        });
    });
});
