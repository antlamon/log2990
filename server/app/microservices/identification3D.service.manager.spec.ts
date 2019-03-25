import { expect } from "chai";
import { BASE_ID, ERROR_ID, Message, Message3D } from "../../../common/communication/message";
import {  ADD_TYPE, IDifference } from "../../../common/models/game3D";
import { Identification3DServiceManager } from "./identification3D.service.manager";

describe("Identification service tests", () => {

    let serviceManager: Identification3DServiceManager;
    const mockDiff: IDifference = {
        type: ADD_TYPE,
        name: "1",
    };

    before(() => {
        serviceManager = new Identification3DServiceManager();
    });

    it("Trying to get a difference on a non instanciated service return a message", () => {
        const gameRoomId: string = "blabalbal";
        const message: Message = serviceManager.getDifference(gameRoomId, "") as Message;
        expect(message.body).to.contain(Identification3DServiceManager.IDENTIFICATION_3D_SERVICE_NOT_FOUND);
    });

    it("Trying to delete a non existing identification service should return error message", () => {
        const gameRoomId: string = "test";
        expect(serviceManager.deleteService(gameRoomId).title).to.equal(ERROR_ID);
    });

    describe("Adding a new identification service", () => {
        const gameRoomId: string = "a123";
        it("Creating a new identification service", () => {
            expect(serviceManager.startNewService(gameRoomId, [mockDiff]).body).to.equal(gameRoomId);
            expect(Object.keys(serviceManager["identification3DServices"]).length).to.be.greaterThan(0);
        });

        it("Trying to add the same gameId should not work", () => {
            expect(serviceManager.startNewService(gameRoomId, [mockDiff]).body)
                .to.contain(Identification3DServiceManager.GAMEROOMID_ALREADY_EXISTS);
        });

        it("Finding a difference in the image return the name and type of the difference", () => {
            const newImage: Message3D = serviceManager.getDifference(gameRoomId, mockDiff.name) as Message3D;
            expect(newImage.body.name).to.equal(mockDiff.name);
        });

        it("Finding no difference in the image should return no difference string", () => {
            expect(serviceManager.getDifference(gameRoomId, "2").body).to.equal(Identification3DServiceManager.NO_DIFFERENCE_FOUND);
        });

        it("Deleting a gameRoomId service should return base message", () => {
            expect(serviceManager.deleteService(gameRoomId).title).to.equal(BASE_ID);
        });
    });
});
