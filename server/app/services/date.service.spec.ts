import Axios from "axios";
import * as chai from "chai";
import * as spies from "chai-spies";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import { IDate } from "./IDate";
import { DateService } from "./date.service";

chai.use(spies);
const expect: Chai.ExpectStatic = chai.expect;

describe("function currentTime", () => {
    let service: DateService;
    let sandbox: ChaiSpies.Sandbox;

    beforeEach(() => {
        service = new DateService();
        sandbox = chai.spy.sandbox();
    });

    afterEach(() => {
        sandbox.restore();
    });

    it("should return correct date", async () => {
        const mockedData: IDate = {
            currentDateTime: "24:00",
            timeZoneName: "",
            dayOfTheWeek: "",
        };
        sandbox.on(Axios, "get", () => Promise.resolve({
            data: mockedData,
        }));
        const result: Message = await service.currentTime();
        expect(result.title).to.equal("Time");
        expect(result.body).to.equal(mockedData.currentDateTime);
    });
});
