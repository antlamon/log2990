import { expect } from "chai";
import {ConnexionService} from "./connexion.service";
import { Message,ERROR_ID,BASE_ID } from "../../../common/communication/message";
describe('Test for the function isCorrectLength', () => {
    it('A empty string should return false', (done) => {
        expect(ConnexionService.isCorrectLength("")).to.equal(false);
        done();
    });
    it('A null string should return false', (done) => {
        expect(ConnexionService.isCorrectLength(null)).to.equal(false);
        done();
    });
    it('A string under '+ConnexionService.MIN_LENGTH+' char should return false', (done) => {
        expect(ConnexionService.isCorrectLength('aa')).to.equal(false);
        done();
    });
    it('A string above '+ConnexionService.MAX_LENGTH+' char should return false', (done) => {
        expect(ConnexionService.isCorrectLength("aaaaaaaaaaa")).to.equal(false);
        done();
    });
    it('A string between '+ConnexionService.MIN_LENGTH+'and'+ConnexionService.MAX_LENGTH+' should return true', (done) => {
        expect(ConnexionService.isCorrectLength("aaaaa")).to.equal(true);
        done();
    });
});
describe("Test for the function containAlphaNumerics",()=> {
    it('A null string should return false', () => {
        expect(ConnexionService.containOnlyAlphaNumeric(null)).to.equal(false);
    });
    it('A string containing only regular char should return true', () => {
        expect(ConnexionService.containOnlyAlphaNumeric("abc123")).to.equal(true);
    });
    it('An empty string should return false', () => {
        expect(ConnexionService.containOnlyAlphaNumeric("")).to.equal(false);
    });
    it('A string containing @ should return false', () => {
        expect(ConnexionService.containOnlyAlphaNumeric("@")).to.equal(false);
    });
    it('A string containing both alpha numerics char and non alpha numerics char should return false', () => {
        expect(ConnexionService.containOnlyAlphaNumeric("abc123@")).to.equal(false);
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
            expect(message.title).to.equal(ERROR_ID);
        });
    });
    it('An string not present in the names array should not modify the name array and should return a error message', () => {
        component = new ConnexionService();
        let nbNames:number = component.names.length;
        component.removeName("isNotPresent");
        component.removeName("isNotPresent").then( (message:Message) =>{
            expect(message.title).to.equal(ERROR_ID);
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