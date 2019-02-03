import chai = require("chai");
import spies = require("chai-spies");
import { readFileSync } from "fs";
import { ConvertImage, ImageBMP, Pixel } from "./convertImage.service";
import { ImageService } from "./image.service";
import { PATHS } from "../path";

const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe ( "imageService tests", () => {
    const convertService: ConvertImage = new ConvertImage();
    const service: ImageService = new ImageService(convertService);
    const path1: string = PATHS.TEST_IMAGES_PATH + "image_test_1.bmp";
    const path2: string = PATHS.TEST_IMAGES_PATH + "image_test_2.bmp";
    const path3: string = PATHS.TEST_IMAGES_PATH + "/wrong_size_image.bmp";
    const path4: string = PATHS.TEST_IMAGES_PATH + "image_result.bmp";
    const path5: string = PATHS.TEST_IMAGES_PATH + "expectedImage.bmp";
    const path6: string = PATHS.TEST_IMAGES_PATH + "image_wrongformat.bmp"

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
    describe("Contains fonction tests", () => {
        it("Should contain the data", () => {
            expect(service.contains([[0, 1], [1, 0], [-1, 1]], [1, 0])).to.equal(true);

        });
        it("Should not contain the data", () => {

            expect(service.contains([[0, 1], [1, 0], [-1, 1]], [1, -1])).to.equal(false);
        });

    });
    describe("Comparing data tests", () => {

        it("Should return the expected image with the enlarged pixels", () => {

            const image1: ImageBMP = convertService.bufferToImageBMP(readFileSync(path1));
            const image2: ImageBMP = convertService.bufferToImageBMP(readFileSync(path2));

            const pixels: Pixel[][] = service.compareData(image1, image2).pixels;
            let same: boolean = true;
            const expectedPixels: Pixel[][] = convertService.bufferToImageBMP(readFileSync(path5)).pixels;
            for (let i: number = 0; i < image1.height; i++) {
                for (let j: number = 0; j < image1.width; j++) {
                    if (!service.comparePixel(pixels[i][j], expectedPixels[i][j])) {
                        same = false;
                    }
                }
            }
            expect(same).to.equal(true);
        });

        it("Should return a white image when comparing with the same image", () => {

            const image2: ImageBMP = convertService.bufferToImageBMP(readFileSync(path2));

            const pixels: Pixel[][] = service.compareData(image2, image2).pixels;
            let same: boolean = true;
            for (let i: number = 0; i < image2.height; i++) {
                for (let j: number = 0; j < image2.width; j++) {
                    if (!service.comparePixel(pixels[i][j], {red: 255, blue: 255, green: 255})) {
                        same = false;
                    }
                }
            }
            expect(same).to.equal(true);
        });

        it("Should return an error for wrong size", () => {
            const image1: ImageBMP = convertService.bufferToImageBMP(readFileSync(path1));
            const image3: ImageBMP = convertService.bufferToImageBMP(readFileSync(path3));
            expect(() => service.compareData(image1, image3)).to.throw(Error);
        });

    });

    describe("Counting the differences", () => {

        it("Should return the correct number of differences", async (done: MochaDone) => {
            const image: ImageBMP = convertService.bufferToImageBMP(readFileSync(path4));
            expect(service.getNbDifferences(image)).to.equal(4);
            done();
        });

    });

    describe("Getting different image", () => {
        const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

        afterEach(() => {
            sandbox.restore();
        });

        it("Should create an result.bmp file", async () => {
            sandbox.on(service, "getNbDifferences", () => 7);
            expect(service.getDifferencesImage("testImage", readFileSync(path1), readFileSync(path2)).body).to.equal("testImage");
        });

        it("Should return a string with a error message for the format", () => {
            const buffer: Buffer = readFileSync(path6);
            expect(service.getDifferencesImage("name", readFileSync(path1), buffer).body).to.
                equal(ConvertImage.ERROR_MESSAGE_WRONG_FORMAT);

        });
        it("Should return an error for wrong number of differences", () => {
            sandbox.on(service, "getNbDifferences", () => 3);
            expect(service.getDifferencesImage("name", readFileSync(path1), readFileSync(path2)).body).to.equal(ImageService.ERROR_MESSAGE_NOT_7_ERRORS);
        });
    });

});
