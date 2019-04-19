import { IndexService } from "./index.service";
import { Message, BASE_ID } from "../../../../common/communication/message";
import { TestHelper } from "../../test.helper";
// tslint:disable-next-line:no-any Used to mock the http call
let httpClientSpy: any;
let indexService: IndexService;
import {SocketService} from "./socket.service";
describe("IndexService", () => {

    beforeEach(() => {
        httpClientSpy = jasmine.createSpyObj("HttpClient", ["get"]);
        indexService = new IndexService(httpClientSpy, new SocketService());
    });

    it("should return expected message (HttpClient called once)", () => {

        const expectedMessage: Message = { body: "The name testname was added to the list of names", title: BASE_ID };

        httpClientSpy.get.and.returnValue(TestHelper.asyncData(expectedMessage));

        // check the content of the mocked call
        indexService.connect("testname").subscribe(
            (response: Message) => {
                expect(response.title).toEqual(expectedMessage.title, BASE_ID);
                expect(response.body).toEqual(expectedMessage.body, "The name testname was added to the list of names");
            },
            fail
        );

        // check if only one call was made
        expect(httpClientSpy.get.calls.count()).toBe(1, "one call");
    });
});
