import { expect } from "chai";
import { PATHS } from "../path";
import { ConvertImage } from "./convertImage.service";
import { IdentificationService } from "./identification.service";

describe("Identification service tests", () => {
    const convertService: ConvertImage = new ConvertImage();
    const path1: string = PATHS.TEST_IMAGES_PATH + "image_test_1.bmp";
    const path2: string = PATHS.TEST_IMAGES_PATH + "image_test_2.bmp";
    const path3: string = PATHS.TEST_IMAGES_PATH + "image_result.bmp";
    let service: IdentificationService;

    beforeEach(() => {
        service = new IdentificationService(convertService, path1, path2, path3);
    });

    it("Finding an difference in the image should return a new image in string", () => {
        const newImage: string = service.getDifference({ x: 215, y: 0 });
        expect(newImage.length).to.be.greaterThan(0);
    });

    it("Finding no difference in the image should return empty string", () => {
        const newImage: string = service.getDifference({ x: 0, y: 0 });
        expect(newImage.length).to.equal(0);
    });

    it("Finding all differences should return the original image", () => {
        service.getDifference({ x: 215, y: 0 });
        service.getDifference({ x: 0, y: 200 });
        service.getDifference({ x: 121, y: 300 });
        service.getDifference({ x: 550, y: 100 });
        expect(service["modifiedImage"].pixels).to.eql(service["originalImage"].pixels);
    });
});
