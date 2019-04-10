import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { of } from "rxjs";
import { AppRoutingModule } from "src/app/app-routing.module";
import { IndexService } from "src/app/services/index.service";
import { GameRoomUpdate } from "../../../../../common/communication/message";
import { IFullGame, IGame } from "../../../../../common/models/game";
import { Game2DViewComponent } from "./game2D-view.component";
import { MatProgressSpinnerModule } from "@angular/material";
import { ErrorPopupComponent } from "../error-popup/error-popup.component";
import { GameMessagesComponent } from "../game-messages/game-messages.component";

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
describe("Game2DViewComponent", () => {
    let component: Game2DViewComponent;
    let fixture: ComponentFixture<Game2DViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Game2DViewComponent,
                ErrorPopupComponent,
                GameMessagesComponent,
            ],
            imports: [RouterTestingModule, HttpClientModule, HttpClientTestingModule, MatProgressSpinnerModule],
            providers: [IndexService, AppRoutingModule],
        })
            .compileComponents().then(() => { }, (error: Error) => {
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game2DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component["simpleGame"] = mockedFullGame;
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
            username: "test",
            newImage: "testImage",
            differencesFound: 3,
            isGameOver: false,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(component["simpleGame"].modifiedImage).toEqual(update.newImage);
        expect(component["differencesFound"]).toEqual(update.differencesFound);
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference when no differences are found should play a sound and show an error popup", async () => {
        const spy: jasmine.Spy = spyOn(component["errorSound"], "play").and.returnValue(Promise.resolve());
        const spyE: jasmine.Spy = spyOn(component["errorPopup"], "showPopup").and.callFake(() => {});
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: -1,
            isGameOver: false,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
        expect(spyE).toHaveBeenCalled();
    });
    it("handle check difference when no differences are found should disable click for 1sec", async (done) => {
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: -1,
            isGameOver: false,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(component.disableClick).toEqual("disable-click");
        expect(component.blockedCursor).toEqual("cursor-not-allowed");
        setTimeout(() => {
            expect(component.disableClick).toEqual("");
            expect(component.blockedCursor).toEqual("");
            done();
        },         component["ONE_SEC_IN_MS"] + 1);

    });

    it("handle check difference should play the victory sound with 7 differences", async () => {
        const spy: jasmine.Spy = spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("A event should be sent to the socket once 7 differences are found", () => {
        const spy: jasmine.Spy = spyOn(component["socket"], "emitEvent").and.callFake(() => {});
        spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("After 7 differences, the timer should be stopped", async () => {
        const spy: jasmine.Spy = spyOn(component["timer"], "stopTimer");
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("The router should be called 7 differences are found", () => {
        spyOn(component["socket"], "emitEvent").and.callFake(() => {});
        const spy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 7,
            isGameOver: true,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });
    it("get blockedCursor() should correctly return the value of blockCursor", () => {
        component["_blockedCursor"] = "test123";
        expect(component.blockedCursor).toEqual("test123");
    });
    it("get disableClick() should correctly return the value of disableClick", () => {
        component["_disableClick"] = "test123";
        expect(component.disableClick).toEqual("test123");
    });

});
