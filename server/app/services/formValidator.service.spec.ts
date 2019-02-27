import chai = require("chai");
import spies = require("chai-spies");
import { FORM_ERROR, FORMAT_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { THEMATIC_TYPE_NAME } from "../../../common/models/game3D";
import { container } from "../inversify.config";
import { TYPES } from "../types";
import { FormValidatorService } from "./formValidator.service";

const mockBadNb: IGame3DForm = {
    name: "newgame",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 3,
    modifications: {add: true, delete: true, color: true},
};
const mockBadModifs: IGame3DForm = {
    name: "newgmae",
    objectType: THEMATIC_TYPE_NAME,
    objectQty: 13,
    modifications: {add: false, delete: false, color: false},
};
const mockBadLongGameName: IGame3DForm = {
    name: "heresasdsdadfsdgsdfdvf",
    objectType: "fake bad type",
    objectQty: 13,
    modifications: {add: true, delete: true, color: true},
};
const mockBadGameName: IGame3DForm = {
    name: "hi@1",
    objectType: "fake bad type",
    objectQty: 13,
    modifications: {add: true, delete: true, color: true},
};

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

const MIN_TEST: number = 3;
const MAX_TEST: number = 10;

describe("FormValidator service", () => {
    let service: FormValidatorService;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        service = container.get<FormValidatorService>(TYPES.FormValidatorService);
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    describe("Test for the function isCorrectLength", () => {
        it("A empty string should return false", () => {
            expect(service.isCorrectLength("", MIN_TEST, MAX_TEST)).to.equal(false);
        });
        it("A string under min should return false", () => {
            expect(service.isCorrectLength("aa", MIN_TEST, MAX_TEST)).to.equal(false);
        });
        it("A string above max should return false", () => {
            expect(service.isCorrectLength("aaaaaaaaaaa", MIN_TEST, MAX_TEST)).to.equal(false);
        });
        it( "A string between the min and max should return true",
            () => {
                expect(service.isCorrectLength("aaaaa", MIN_TEST, MAX_TEST)).to.equal(true);
            });
    });

    describe("Test for the function containAlphaNumerics", () => {
        it("A string containing only regular char should return true", () => {
            expect(service.containOnlyAlphaNumeric("abc123")).to.equal(true);
        });
        it("An empty string should return false", () => {
            expect(service.containOnlyAlphaNumeric("")).to.equal(false);
        });
        it("A string containing @ should return false", () => {
            expect(service.containOnlyAlphaNumeric("@")).to.equal(false);
        });
        it("A string containing both alpha numerics char and non alpha numerics char should return false", () => {
            expect(service.containOnlyAlphaNumeric("abc123@")).to.equal(false);
        });
    });
    describe("Should validate the number of objects and the modifications", () => {
        it("Should throw an error for missing modifications  ", async () => {

            expect(() => service.validate3DForm(mockBadModifs)).to.throw(FORM_ERROR);
        });
        it("Should throw an error for the wrong number of objects", async () => {

            expect(() => service.validate3DForm(mockBadNb)).to.throw(FORM_ERROR);
        });
        it("Should throw an error for the unvalid name", async () => {

            expect(() => service.validate3DForm(mockBadLongGameName)).to.throw(FORMAT_ERROR);
        });
        it("Should throw an error for the unvalid name", async () => {

            expect(() => service.validate3DForm(mockBadGameName)).to.throw(FORMAT_ERROR);
        });
    });

});
