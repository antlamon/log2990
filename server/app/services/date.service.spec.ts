import Axios from "axios";
import * as chai from "chai";
import * as spies from "chai-spies";
import { Container } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import { TYPES } from "../types";
import { DateService } from "./date.service";
import { IDate } from "./IDate";

const container: Container = new Container();
container.bind<DateService>(TYPES.DateService).to(DateService);

const service: DateService =
     container.get<DateService>(TYPES.DateService);

chai.use(spies);
const expect: Chai.ExpectStatic = chai.expect;

describe("function currentTime", () => {
    it("should return correct date", async () => {
        const mockedData: IDate = {
            currentDateTime: "24:00",
            timeZoneName: "",
            dayOfTheWeek: "",
        };
        chai.spy.on(Axios, "get", () => Promise.resolve({
            data: mockedData,
        }));
        const result: Message = await service.currentTime();
        expect(result.title).to.equal("Time");
        expect(result.body).to.equal(mockedData.currentDateTime);
    });

});
