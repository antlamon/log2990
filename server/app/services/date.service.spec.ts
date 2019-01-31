import { expect } from "chai";
import { Container } from "inversify";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message } from "../../../common/communication/message";
import { TYPES } from "../types";
import { DateService } from "./date.service";

@injectable()
class DateServiceBidon {

    public currentTime(): Promise<Message> {
        return new Promise<Message>(function(resolve, reject) {
                                        resolve({title: "Time",
                                                 body: "Aujourd'hui"});
                                    });
    }
}

const container: Container = new Container();
container.bind<DateService>(TYPES.DateService).to(DateServiceBidon);

const service: DateService =
     container.get<DateService>(TYPES.DateService);

describe("function currentTime", () => {
    it("should return correct date", async () => {
        const result: Message = await service.currentTime();
        expect(result.body).to.equal("Aujourd'hui");
    });

});
