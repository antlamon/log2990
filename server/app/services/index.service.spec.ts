import Axios, { AxiosError } from "axios";
import * as chai from "chai";
import * as spies from "chai-spies";
import { Done } from "mocha";
import { Message } from "../../../common/communication/message";
import { IDate } from "./IDate";
import { IndexService } from "./index.service";

describe("Index service", () => {
    let indexService: IndexService;
    let sandbox: ChaiSpies.Sandbox;

    chai.use(spies);
    const expect: Chai.ExpectStatic = chai.expect;

    beforeEach(() => {
        indexService = new IndexService();
        sandbox = chai.spy.sandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("Should return about message", (done: Done) => {
        const message: Message = indexService.about();
        expect(message.title).to.equal("This is merely a test");
        expect(message.body).to.equal("Lorem ipsum........");
        done();
    });

    it("Should return HelloWorld message", async () => {
        const mockedData: IDate = {
            currentDateTime: "24:00",
            timeZoneName: "",
            dayOfTheWeek: "",
        };

        sandbox.on(Axios, "get", () => Promise.resolve({
            data: mockedData,
        }));

        indexService.helloWorld().then((message: Message) => {
            expect(message.title).to.equal("Hello world");
            expect(message.body).to.equal("Time is 24:00");
        });
    });

    it("Should return error on HelloWorld", async () => {
        sandbox.on(Axios, "get", () => Promise.reject({} as AxiosError));

        return indexService.helloWorld().then((message: Message) => {
            expect(message.title).to.equal("Error");
            expect(message.body).to.equal(({} as AxiosError).toString());
        });
    });
});
