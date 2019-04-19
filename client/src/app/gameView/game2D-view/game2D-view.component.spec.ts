import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { MatProgressSpinnerModule } from "@angular/material";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { IndexService } from "src/app/services/index.service";
import { Gamer, GameRoomUpdate, NewGameStarted } from "../../../../../common/communication/message";
import { IFullGame, IGame } from "../../../../../common/models/game";
import { ErrorPopupComponent } from "../error-popup/error-popup.component";
import { GameMessagesComponent } from "../game-messages/game-messages.component";
import { EndingMessageComponent } from "../ending-message/ending-message.component";
import { ModalService } from "src/app/services/modal.service";
import { Game2DViewComponent } from "./game2D-view.component";

const mockedGame: IGame = {
    id: "mockedID",
    name: "testGame",
    originalImage: "",
    solo: [],
    multi: [],
};
const mockedFullGame: IFullGame = {
    card: mockedGame,
    modifiedImage: " ",
    differenceImage: " ",
};
const mockGamers: Gamer[] = [
    {
        username: "winner",
        differencesFound: 4,
        isReady: true,
    },
    {
        username: "looser",
        differencesFound: 0,
        isReady: true,
        },

];
describe("Game2DViewComponent", () => {
    let component: Game2DViewComponent;
    let fixture: ComponentFixture<Game2DViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Game2DViewComponent,
                ErrorPopupComponent,
                GameMessagesComponent,
                EndingMessageComponent
            ],
            imports: [RouterTestingModule,
                HttpClientModule,
                HttpClientTestingModule,
                MatProgressSpinnerModule
            ],
            providers: [IndexService, AppRoutingModule, ModalService ],
        })
            .compileComponents().then(() => { }, (error: Error) => {
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game2DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component["simpleGame"] = mockedFullGame;
        component["gamers"] = mockGamers;
        component["gameRoomId"] = "yolo";
        spyOn(component["gameService"], "getSimpleGame").and.returnValue(of(mockedFullGame));
         });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("get simple game should init the simple game", async () => {
        const socketSpy: jasmine.Spy = spyOn(component["socket"], "emitEvent").and.returnValue(Promise.resolve());
        component["getSimpleGame"]();
        expect(component["simpleGame"]).toEqual(mockedFullGame);
        expect(socketSpy).toHaveBeenCalled();
    });

    it("should send click event", () => {
        const spy: jasmine.Spy = spyOn(component["socket"], "emitEvent");
        component.sendClick(new MouseEvent("click"));
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference should modify the modified image and play a sound", async () => {
        const spy: jasmine.Spy = spyOn(component["correctSound"], "play").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: mockGamers[0].username,
            newImage: "testImage",
            differencesFound: 1,
            isGameOver: false,
        };
        component["index"]["username"] = mockGamers[0].username;
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(component["simpleGame"].modifiedImage).toEqual(update.newImage);
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference when no differences are found should play a sound and show an error popup", async () => {
        const spy: jasmine.Spy = spyOn(component["errorSound"], "play").and.returnValue(Promise.resolve());
        const spyE: jasmine.Spy = spyOn(component["errorPopup"], "showPopup").and.callFake(() => {});
        const update: GameRoomUpdate = {
            username: "looser",
            newImage: "testImage",
            differencesFound: -1,
            isGameOver: false,
        };
        component["index"]["username"] = "looser";
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
        expect(spyE).toHaveBeenCalled();
    });
    it("handle check difference when no differences are found should disable click for 1sec", async (done) => {
        const update: GameRoomUpdate = {
            username: mockGamers[0].username,
            newImage: "testImage",
            differencesFound: -1,
            isGameOver: false,
        };
        component["lastClick"] = new MouseEvent("click");
        component["index"]["username"] = mockGamers[0].username;
        component["handleCheckDifference"](update);
        expect(component.disableClick).toEqual("disable-click");
        expect(component.blockedCursor).toEqual("cursor-not-allowed");
        setTimeout(() => {
            expect(component.disableClick).toEqual("");
            expect(component.blockedCursor).toEqual("");
            done();
        },         component["CLICK_DELAY"] + 1);

    });

    it("handle check difference should play the victory sound with 7 differences, when in solo mode", async () => {
        const spy: jasmine.Spy = spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
        component["gamers"] = [mockGamers[0]]; // only 1 gamer in solo mode
        const update: GameRoomUpdate = {
            username: mockGamers[0].username,
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["index"]["username"] = mockGamers[0].username;
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("An event should be sent to the socket once 7 differences are found, in solo mode", () => {
        const spy: jasmine.Spy = spyOn(component["socket"], "emitEvent").and.callFake(() => {});
        spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
        component["gamers"] = [mockGamers[0]]; // only 1 gamer in solo mode
        const update: GameRoomUpdate = {
            username: mockGamers[0].username,
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["index"]["username"] = mockGamers[0].username;
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("After 7 differences, the timer should be stopped, in solo mode", async () => {
        const spy: jasmine.Spy = spyOn(component["timer"], "stopTimer");
        component["gamers"] = [mockGamers[0]]; // only 1 gamer in solo mode
        const update: GameRoomUpdate = {
            username: mockGamers[0].username,
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["index"]["username"] = mockGamers[0].username;
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    describe("handleCreateGameRoom function", () => {
        it("should set the component's gamers and roomID properties according to the data sent by the event", () => {
            const mockMessage: NewGameStarted = {
                gameRoomId: "",
                players: [],
            };
            component["handleCreateGameRoom"](mockMessage);
            expect(component["gameRoomId"]).toEqual(mockMessage.gameRoomId);
            expect(component["gamers"]).toEqual(mockMessage.players);
        });
    });

    describe("handleCreateGameRoom function", () => {
        it("should call the soloEndGame modal from the modalService", () => {
            component["gamers"] = [mockGamers[0]]; // only 1 gamer in solo mode
            const spyEndGame: jasmine.Spy = spyOn(component["modalService"], "open");
            component.openEndingDialog("WON");
            expect(spyEndGame).toHaveBeenCalledWith("soloEndGame");
        });

        it("should call the multWinGame modal from the modalService", () => {
            component["gamers"] = mockGamers;
            const spyEndGame: jasmine.Spy = spyOn(component["modalService"], "open");
            component.openEndingDialog("WON");
            expect(spyEndGame).toHaveBeenCalledWith("multWinGame");
        });

        it("should call the multLostGame modal from the modalService", () => {
            component["gamers"] = mockGamers;
            const spyEndGame: jasmine.Spy = spyOn(component["modalService"], "open");
            component.openEndingDialog("LOST");
            expect(spyEndGame).toHaveBeenCalledWith("multLostGame");
        });
    });
});
