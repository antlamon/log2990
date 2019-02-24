import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game2DViewComponent } from "./game2D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { GameRoomUpdate } from "../../../../../common/communication/message";
import { IFullGame, IGame } from "../../../../../common/models/game";

describe("Game2DViewComponent", () => {
    let component: Game2DViewComponent;
    let fixture: ComponentFixture<Game2DViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Game2DViewComponent],
            imports: [HttpClientModule, RouterModule.forRoot([])]
        })
            .compileComponents().then(() => { }, (error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game2DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should send click event", () => {
        const spy: jasmine.Spy = spyOn(component["socket"], "emitEvent");
        component.sendClick(new MouseEvent("click"));
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference should modify the modified image and play a sound", async () => {
        const spy: jasmine.Spy = spyOn(component["correctSound"], "play");
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: 3,
        };
        component.handleCheckDifference(update);
        expect(component.simpleGame.modifiedImage).toEqual(update.newImage);
        expect(component.differencesFound).toEqual(update.differencesFound);
        expect(spy).toHaveBeenCalled();
    });

    it("handle check difference when no differences are found should play a sound", async () => {
        const spy: jasmine.Spy = spyOn(component["errorSound"], "play");
        const update: GameRoomUpdate = {
            username: "test",
            newImage: "testImage",
            differencesFound: -1,
        };
        component.handleCheckDifference(update);
        expect(spy).toHaveBeenCalled();
    });

    it("get simple game should init the simple game", () => {
        const fullGame: IFullGame = {
            card: {
                id: "test",
                originalImage: "origin",
            } as IGame,
            modifiedImage: "modif",
            differenceImage: "diff"
        };
        const socketSpy: jasmine.Spy = spyOn(component["socket"], "emitEvent");
        spyOn(component["gameService"], "getSimpleGame").and.returnValue(
            Promise.resolve(fullGame)
        );
        component.getSimpleGame();
        expect(component.simpleGame).toEqual(fullGame);
        expect(socketSpy).toHaveBeenCalled();
    });
});
