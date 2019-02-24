import { expect } from "chai";
import { readFileSync } from "fs";
import { BASE_ID, ERROR_ID, Message } from "../../../common/communication/message";
import { PATHS } from "../path";
import { ConvertImage } from "./convertImage.service";
import { IdentificationService } from "./identification.service";
import { IdentificationServiceManager } from "./identification.service.manager";

describe("Identification service tests", () => {
    const BMP_S64_HEADER: string = "data:image/bmp;base64,";
    const convertService: ConvertImage = new ConvertImage();

    const image: string = BMP_S64_HEADER + readFileSync(PATHS.TEST_IMAGES_PATH + "image_test_1.bmp").toString("base64");
    const modifiedImage: string = BMP_S64_HEADER + readFileSync(PATHS.TEST_IMAGES_PATH + "image_test_2.bmp").toString("base64");
    const differenceImage: string = BMP_S64_HEADER + readFileSync(PATHS.TEST_IMAGES_PATH + "image_result.bmp").toString("base64");
    let serviceManager: IdentificationServiceManager;

    before(() => {
        serviceManager = new IdentificationServiceManager(convertService);
    });

    it("Trying to get a difference on a non instanciated service return a message", () => {
        const gameRoomId: string = "blabalbal";
        const message: Message = serviceManager.getDifference(gameRoomId, { x: 215, y: 0 });
        expect(message.body).to.contain(IdentificationServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND);
    });

    it("Trying to delete a non existing identification service should return error message", () => {
        const gameRoomId: string = "test";
        expect(serviceManager.deleteService(gameRoomId).title).to.equal(ERROR_ID);
    });

    describe("Adding a new identification service", () => {
        const gameRoomId: string = "a123";
        it("Creating a new identification service", () => {
            expect(serviceManager.startNewService(gameRoomId, image, modifiedImage, differenceImage).body).to.equal(gameRoomId);
            expect(Object.keys(serviceManager["identificationServices"]).length).to.be.greaterThan(0);
        });

        it("Trying to add the same gameId should not work", () => {
            expect(serviceManager.startNewService(gameRoomId, image, modifiedImage, differenceImage).body)
                .to.contain(IdentificationServiceManager.GAMEROOMID_ALREADY_EXISTS);
        });

        it("Adding another identification service shouldnt reset the bmp buffer", () => {
            const buffer: Buffer = serviceManager["bmpBufferFormat"];
            serviceManager.startNewService("newID", image, modifiedImage, differenceImage);
            expect(buffer).to.eql(serviceManager["bmpBufferFormat"]);
        });

        it("Finding a difference in the image should return a new image in string", () => {
            const newImage: Message = serviceManager.getDifference(gameRoomId, { x: 215, y: 0 });
            expect(newImage.body.length).to.be.greaterThan(0);
        });

        it("Finding no difference in the image should return no difference string", () => {
            const newImage: Message = serviceManager.getDifference(gameRoomId, { x: 0, y: 0 });
            expect(newImage.body).to.equal(IdentificationServiceManager.NO_DIFFERENCE_FOUND);
        });

        it("Finding all differences should return the original image", () => {
            serviceManager.getDifference(gameRoomId, { x: 215, y: 0 });
            serviceManager.getDifference(gameRoomId, { x: 0, y: 200 });
            serviceManager.getDifference(gameRoomId, { x: 121, y: 300 });
            serviceManager.getDifference(gameRoomId, { x: 550, y: 100 });
            const service: IdentificationService = serviceManager["identificationServices"][gameRoomId];
            expect(service["modifiedImage"].pixels).to.eql(service["originalImage"].pixels);
        });

        it("Deleting a gameRoomId service should return base message", () => {
            expect(serviceManager.deleteService(gameRoomId).title).to.equal(BASE_ID);
        });
    });
});
