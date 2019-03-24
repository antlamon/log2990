import { HttpClientModule } from "@angular/common/http";
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
                ErrorPopupComponent
            ],
            imports: [RouterTestingModule, HttpClientModule, MatProgressSpinnerModule],
            providers: [IndexService, AppRoutingModule],
        })
            .compileComponents().then(() => { }, (error: Error) => {
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game2DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        component.simpleGame = mockedFullGame;
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
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(component["simpleGame"].modifiedImage).toEqual(update.newImage);
        expect(component.differencesFound).toEqual(update.differencesFound);
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference when no differences are found should play a sound", async () => {
        const spy: jasmine.Spy = spyOn(component["errorSound"], "play").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: -1,
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference should play the victory sound", async () => {
        const spy: jasmine.Spy = spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 7,
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
        };
        component["lastClick"] = new MouseEvent("click");
        component["handleCheckDifference"](update);
        expect(spy).toHaveBeenCalled();
    });

});
