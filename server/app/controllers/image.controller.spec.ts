import { expect } from "chai";
import { ConvertImage } from "../services/convertImage.service";
import { ImageService } from "../services/image.service";
import { ImageController } from "./image.controller";

describe("Image Controller tests", () => {

    const controller: ImageController = new ImageController(new ImageService(new ConvertImage));
    it("Should call the service", () => {

        expect(controller.url).to.equal("/imagegen");
    });

});
