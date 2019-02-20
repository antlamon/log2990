import { expect } from "chai";
import { Message } from "../../../common/communication/message";
import { PATHS } from "../path";
import { ConvertImage } from "./convertImage.service";
import { IdentificationService } from "./identification.service";
import { IdentificationServiceManager } from "./identification.service.manager";

describe("Identification service tests", () => {
    const convertService: ConvertImage = new ConvertImage();
    const path1: string = PATHS.TEST_IMAGES_PATH + "image_test_1.bmp";
    const path2: string = PATHS.TEST_IMAGES_PATH + "image_test_2.bmp";
    const path3: string = PATHS.TEST_IMAGES_PATH + "image_result.bmp";
    let serviceManager: IdentificationServiceManager;

    before(() => {
        serviceManager = new IdentificationServiceManager(convertService);
    });

    it("Trying to get a difference on a non instanciated service return a message", () => {
        const gameId: string = "blabalbal";
        const message: Message = serviceManager.getDifference(gameId, { x: 215, y: 0 });
        expect(message.body).to.contain(IdentificationServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND);
    });

    describe("Adding a new identification service", () => {
        const gameId: string = "a123";
        it("Creating a new identification service", () => {
            expect(serviceManager.startNewService(gameId, path1, path2, path3).body).to.equal("");
            expect(Object.keys(serviceManager["identificationServices"]).length).to.be.greaterThan(0);
        });

        it("Trying to add the same gameId should not work", () => {
            expect(serviceManager.startNewService(gameId, path1, path2, path3).body)
                .to.contain(IdentificationServiceManager.GAMEID_ALREADY_EXISTS);
        });

        it("Adding another identification service shouldnt reset the bmp buffer", () => {
            const buffer: Buffer = serviceManager["bmpBufferFormat"];
            serviceManager.startNewService("newID", path1, path2, path3);
            expect(buffer).to.eql(serviceManager["bmpBufferFormat"]);
        });

        it("Finding a difference in the image should return a new image in string", () => {
            const newImage: Message = serviceManager.getDifference(gameId, { x: 215, y: 0 });
            expect(newImage.body.length).to.be.greaterThan(0);
        });

        it("Finding no difference in the image should return no difference string", () => {
            const newImage: Message = serviceManager.getDifference(gameId, { x: 0, y: 0 });
            expect(newImage.body).to.equal(IdentificationServiceManager.NO_DIFFERENCE_FOUND);
        });

        it("Finding all differences should return the original image", () => {
            serviceManager.getDifference(gameId, { x: 215, y: 0 });
            serviceManager.getDifference(gameId, { x: 0, y: 200 });
            serviceManager.getDifference(gameId, { x: 121, y: 300 });
            serviceManager.getDifference(gameId, { x: 550, y: 100 });
            const service: IdentificationService = serviceManager["identificationServices"][gameId];
            expect(service["modifiedImage"].pixels).to.eql(service["originalImage"].pixels);
        });
    });
});
