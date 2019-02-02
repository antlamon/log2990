import { expect } from "chai";
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { TYPES } from "../types";

const mockedGetDiffenrenceData: Message = {
    title: "Image created",
    body: "Image with difference created",
};

const mockedImageService: Object = {
    getDifferentImage: () => mockedGetDiffenrenceData,
};

describe("Image Controller", () => {
    let app: Express.Application;

    before(() => {
        container.snapshot();
        // container.unbind(TYPES.GameListService);
        container.rebind(TYPES.ImageService).toConstantValue(mockedImageService);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        container.restore();
    });

    it("Should return image with difference created", (done: MochaDone) => {
        supertest(app)
        .post("/imagegen")
        .field("name", "test")
        .attach("originalImage", "./app/documents/image_test_1.bmp")
        .attach("modifiedImage", "./app/documents/image_test_2.bmp")
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGetDiffenrenceData, "Image differences not created");
            done(error);
        });
    });
});