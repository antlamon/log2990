// import * as supertest from "supertest";
// import { Message } from "../../../common/communication/message";
// import { Application } from "../app";
// import { container } from "../inversify.config";
// import { IndexService } from "../services/index.service";
// import { TYPES } from "../types";

// const mockedHelloWorld: Message = {
//     title: "Hello world",
//     body: "The time is 24:00",
// };

// const mockedAbout: Message = {
//     title: "Test",
//     body: "Lorem ipsum",
// };

// const mockedIndexService: IndexService = {
//     about: () => mockedAbout,
//     helloWorld: async() => Promise.resolve(mockedHelloWorld),
// };

// describe("Index controller", () => {
//     let app: Express.Application;
//     before(() => {
//         app = container.get<Application>(TYPES.Application).app;
//         container.snapshot();
//         container.rebind(TYPES.IndexService).toConstantValue(mockedIndexService);
//     });

//     after(() => container.restore());

//     it("Should return helloWorld message", async () => {
//         supertest(app)
//             .get("/api/index")
//             .expect(200);
//     });

// });
