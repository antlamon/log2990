import chai = require("chai");
import spies = require("chai-spies");
import supertest = require("supertest");
import { Message } from "../../../common/communication/message";
import { Application } from "../app";
import { container } from "../inversify.config";
import { ImageService } from "../services/image.service";
import { TYPES } from "../types";

const path1: string = "./app/documents/test-images/image_test_1.bmp";
const path2: string = "./app/documents/test-images/image_test_2.bmp";

const mockedGetDiffenrenceData: Message = {
    title: "Image created",
    body: "Image with difference created",
};


const expect: Chai.ExpectStatic = chai.expect;
chai.use(spies);

describe("Image Controller", () => {
    let app: Express.Application;
    const sandbox: ChaiSpies.Sandbox = chai.spy.sandbox();

    before(() => {
        container.snapshot();
        const service: ImageService = container.get<ImageService>(TYPES.ImageService);
        sandbox.on(service, "getDifferentImage", () => mockedGetDiffenrenceData);
        sandbox.on(service, "imageToString64", () => "");
        container.rebind(TYPES.ImageService).toConstantValue(service);
        app = container.get<Application>(TYPES.Application).app;
    });

    after(() => {
        container.restore();
        sandbox.restore();
    });

    it("Should return image with difference created", (done: MochaDone) => {
        supertest(app)
        .post("/api/gamelist/smple")
        .field("name", "test")
        .attach("originalImage", path1)
        .attach("modifiedImage", path2)
        .expect(200)
        .end((error: Error, response: supertest.Response) => {
            expect(response.body).to.eql(mockedGetDiffenrenceData, "Image differences not created");
            done(error);
        });
    });
});
