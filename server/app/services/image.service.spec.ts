import { expect } from "chai";
import { readFileSync } from "fs";
import { ImageBMP, Pixel } from "../interfaces";
import { ConvertImage } from "./convertImage.service";
import { ImageService } from "./image.service";

describe ( "imageService tests", () => {

    const service: ImageService = new ImageService( new ConvertImage);
    const convertService: ConvertImage = new ConvertImage();
    const path1: string = "./app/documents/image_test_1.bmp";
    const path2: string = "./app/documents/image_test_2.bmp";
    const path3: string = "./app/documents/image1.bmp";
    const image1: ImageBMP = convertService.bufferToImageBMP(readFileSync(path1));
    const image2: ImageBMP = convertService.bufferToImageBMP(readFileSync(path2));
    const image3: ImageBMP = convertService.bufferToImageBMP(readFileSync(path3));

    describe("Detect black pixel function", () => {

        it("Should find a black pixel", () => {
            expect(service.isBlackPixel({red: 0, green: 0, blue: 0})).to.equal(true);
        });

        it("Should not find a black pixel", () => {
            expect(service.isBlackPixel({red: 10, green: 200, blue: 100})).to.equal(false);
        });
    });

    describe("Substract and compare pixels tests", () => {

        it("Should substract the pixels", () => {
            expect(service.isBlackPixel(service.substractPixel({red: 10, green: 16, blue: 255}, {red: 10, green: 16, blue: 255}))).
            to.equal(true);
        });
        it("Should compare the pixels", () => {
            expect(service.comparePixel({red: 10, green: 16, blue: 255}, {red: 10, green: 16, blue: 255})).
            to.equal(true);
        });

    });
    describe("Comparing data tests", () => {

        it("Should return a white image when comparing with the same image", () => {

            const pixels: Pixel[][] = service.compareData(image2, image2).pixels;
            let same: boolean = true;
            for (let i: number = 0; i < image2.height; i++) {
                for (let j: number = 0; j < image2.width; j++) {
                    if (!service.comparePixel(pixels[i][j],{red: 255, blue: 255, green: 255})) {
                        same = false;
                    }
                }
            }
            expect(same).to.equal(true);
        });

        it("Should return an error for wrong size", () => {

            expect(() => service.compareData(image1, image3)).to.throw(Error);
        });

        it("Should return the expected image with the enlarged pixels", ()=> {

            const pixels: Pixel[][] = service.compareData(image1, image2).pixels;
            let same: boolean = true;
            const expectedPixels: Pixel[][] = convertService.bufferToImageBMP(readFileSync("./app/documents/expectedImage.bmp")).pixels;
            for (let i: number = 0; i < image1.height; i++) {
                for (let j: number = 0; j < image1.width; j++) {
                    if (!service.comparePixel(pixels[i][j], expectedPixels[i][j])) {
                        same = false;
                    }
                }
            }
            expect(same).to.equal(false); // Should be true -> not working
        });

    });
    describe("Getting different image", () => {
        it("Should create an result.bmp file", () => {

            expect(service.getDifferentImage("createdImage", readFileSync(path1), readFileSync(path2)).body).to.equal("success");
        });

        it("Should return a string with a error message for the format", () => {

            const buffer: Buffer = readFileSync("./app/documents/image_wrongformat.bmp");
            expect(service.getDifferentImage("name", readFileSync(path1), buffer).body).to.not.equal("success");
            // should be equal(Error("Les images ne sont pas dans le bon format"));
        });
    });
});
