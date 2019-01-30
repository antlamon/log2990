// import { expect } from "chai";
// import {ConnexionService} from "./connexion.service";
// import { Message,ERROR_ID,BASE_ID } from "../../../common/communication/message";

// describe('Test for the function isCorrectLength', () => {
//     it('A empty string should return false', (done) => {
//         expect(ConnexionService.isCorrectLength("")).to.equal(false);
//         done();
//     });
//     it('A null string should return false', (done) => {
//         expect(ConnexionService.isCorrectLength(null)).to.equal(false);
//         done();
//     });
//     it('A string under '+ConnexionService.MIN_LENGTH+' char should return false', (done) => {
//         expect(ConnexionService.isCorrectLength('aa')).to.equal(false);
//         done();
//     });
//     it('A string above '+ConnexionService.MAX_LENGTH+' char should return false', (done) => {
//         expect(ConnexionService.isCorrectLength("aaaaaaaaaaa")).to.equal(false);
//         done();
//     });
//     it('A string between '+ConnexionService.MIN_LENGTH+'and'+ConnexionService.MAX_LENGTH+' should return true', (done) => {
//         expect(ConnexionService.isCorrectLength("aaaaa")).to.equal(true);
//         done();
//     });
// });
// describe("Test for the function containAlphaNumerics",()=> {
//     it('A null string should return false', () => {
//         expect(ConnexionService.containOnlyAlphaNumeric(null)).to.equal(false);
//     });
//     it('A string containing only regular char should return true', () => {
//         expect(ConnexionService.containOnlyAlphaNumeric("abc123")).to.equal(true);
//     });
//     it('An empty string should return false', () => {
//         expect(ConnexionService.containOnlyAlphaNumeric("")).to.equal(false);
//     });
//     it('A string containing @ should return false', () => {
//         expect(ConnexionService.containOnlyAlphaNumeric("@")).to.equal(false);
//     });
//     it('A string containing both alpha numerics char and non alpha numerics char should return false', () => {
//         expect(ConnexionService.containOnlyAlphaNumeric("abc123@")).to.equal(false);
//     });
// });
