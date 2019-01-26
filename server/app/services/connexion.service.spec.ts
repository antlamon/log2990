import { expect } from "chai";
import {ConnexionService} from "./connexion.service";
import { Message } from "../../../common/communication/message";
describe('Test for the function isCorrectLength', () => {
    let component:ConnexionService = new ConnexionService();
    it('A empty string should return false', (done) => {
        expect(component.isCorrectLength("")).to.equal(false);
        done();
    });
    it('A null string should return false', (done) => {
        expect(component.isCorrectLength(null)).to.equal(false);
        done();
    });
    it('A string under '+component.MIN_LENGTH+' char should return false', (done) => {
        expect(component.isCorrectLength('aa')).to.equal(false);
        done();
    });
    it('A string above '+component.MAX_LENGTH+' char should return false', (done) => {
        expect(component.isCorrectLength("aaaaaaaaaaa")).to.equal(false);
        done();
    });
    it('A string between '+component.MIN_LENGTH+'and'+component.MAX_LENGTH+' should return true', (done) => {
        expect(component.isCorrectLength("aaaaa")).to.equal(true);
        done();
    });
});
describe("Test for the function containAlphaNumerics",()=> {
    let component:ConnexionService = new ConnexionService();
    it('A null string should return false', () => {
        expect(component.containOnlyAlphaNumeric(null)).to.equal(false);
    });
    it('A string containing only regular char should return true', () => {
        expect(component.containOnlyAlphaNumeric("abc123")).to.equal(true);
    });
    it('An empty string should return false', () => {
        expect(component.containOnlyAlphaNumeric("")).to.equal(false);
    });
    it('A string containing @ should return false', () => {
        expect(component.containOnlyAlphaNumeric("@")).to.equal(false);
    });
    it('A string containing both alpha numerics char and non alpha numerics char should return false', () => {
        expect(component.containOnlyAlphaNumeric("abc123@")).to.equal(false);
    });
});
describe("Test for the function addName",()=> {
    let component:ConnexionService = new ConnexionService();
    it('An empty username should not be added to the names array', () => {
        component.addName("");
        expect(component.names.some(o => o == "")).to.equal(false);
    });
    it('An  username longer than 10 chars should not be added', () => {
        component.addName("aaa@@aa");
        expect(component.names.some(o => o == "")).to.equal(false);
    });
    it('An  username shorter than 3 characters should not be added to the names array', () => {
        component.addName("aaa@@aa");
        expect(component.names.some(o => o == "")).to.equal(false);
    });
    it('An  username containing alphaNumerics chars should not be added to the names array', () => {
        component.addName("aaa@@aa");
        expect(component.names.some(o => o == "")).to.equal(false);
    });
    it('The username HanasBye should be correctly added', () => {
        component.addName("HanasBye");
        expect(component.names.some(o => o == "HanasBye")).to.equal(true);
    });
    it('The username HanasBye should not be added twice', () => {
        component.addName("HanasBye");
        expect(component.names.filter(o => o == "HanasBye").length).to.equal(1);
    });
});
describe("Test for the function removeName",()=> {
    let component:ConnexionService = new ConnexionService();
    it('An null string should return a error message', () => {
        component.removeName(null).then( (message:Message) =>{
            expect(message.title).to.equal(component.ERROR_ID);
        });
    });
    it('An string not present in the names array should not modify the name array and should return a error message', () => {
        component = new ConnexionService();
        let nbNames:number = component.names.length;
        component.removeName("isNotPresent");
        component.removeName("isNotPresent").then( (message:Message) =>{
            expect(message.title).to.equal(component.ERROR_ID);
            expect(component.names.length).to.equal(nbNames);
        });
    });
    it('A name recently added should be removed from the array', () => {
        component = new ConnexionService();
        let nbNames:number = component.names.length;
        component.addName("HanasBuh");
        component.removeName("HanasBuh");
        expect(component.names.length).to.equal(nbNames);
    });
    it('Removing a anme twice should not affect the array beysond the first time', () => {
        component = new ConnexionService();
        let nbNames:number = component.names.length;
        component.addName("Charlie");
        component.removeName("Charlie");
        component.removeName("Charlie");
        expect(component.names.length).to.equal(nbNames);
    });
});