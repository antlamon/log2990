import { expect } from "chai";
import { readFileSync } from "fs";
import { ImageBMP } from "../interfaces";
import { ConvertImage } from "./convertImage.service";
import { ImageService } from "./image.service";

describe ( "imageService tests", () => {

    const service: ImageService = new ImageService( new ConvertImage);
    const convertService: ConvertImage = new ConvertImage();
    const path1: string = "./app/documents/test1.bmp";
    const path2: string = "./app/documents/test2.bmp";
    const image1: ImageBMP = convertService.bufferToImageBMP(readFileSync(path1));
    const image2: ImageBMP = convertService.bufferToImageBMP(readFileSync(path2));

    it("Should find a black pixel", () => {
        expect(service.isBlackPixel({red: 0, green: 0, blue: 0})).to.equal(true);
    });

    it("Should substract the pixels", () => {
        expect(service.isBlackPixel(service.comparePixel({red: 10, green: 16, blue: 255}, {red: 10, green: 16, blue: 255}))).
        to.equal(true);
    });

    it("Should return a white image when comparing two images with the same red pixels", () => {

        let same: boolean = true;
        for (let i: number = 0; i < image2.height; i++) {
            for (let j: number = 0; j < image2.width; j++) {
                if (service.compareData(image2, image2).pixels[i][j].red !== image1.pixels[i][j].red) {
                    same = false;
                }
            }
        }
        expect(same).to.equal(true);
    });

    // it("Should return a black and white image", () => {


    //     service.enlargeBlackPixels(image1, 

    // })
});
