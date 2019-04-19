import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game3DViewComponent } from "./game3D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { RenderService } from "src/app/scene3D/render.service";
import { ShapeCreatorService } from "src/app/scene3D/geometric/shape-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { IGame3D, IDifference } from "../../../../../common/models/game3D";
import { AppRoutingModule } from "src/app/app-routing.module";
import { MatProgressSpinnerModule } from "@angular/material";
import { IScore } from "../../../../../common/models/top3";
import { IndexService } from "src/app/services/index.service";
import { SocketService } from "src/app/services/socket.service";
import { KEYS, AXIS } from "src/app/global/constants";
import { ErrorPopupComponent } from "../error-popup/error-popup.component";
import { MedievalObjectsCreatorService } from "src/app/scene3D/thematic/medieval-objects-creator.service";
import { SceneGeneratorService } from "src/app/scene3D/scene-generator.service";
import { MOUSE } from "three";
import { Game3DRoomUpdate, Gamer, NewGameStarted } from "../../../../../common/communication/message";
import { GameMessagesComponent } from "../game-messages/game-messages.component";
import { EndingMessageComponent } from "../ending-message/ending-message.component";
import { ModalService } from "src/app/services/modal.service";
const mockObjects: IObjet3D[] = [];

const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "dskjahd",
    originalScene: mockObjects,
    solo: [] as IScore[],
    multi: [] as IScore[],
    differences: [] as IDifference[],
    backColor: 0,
    isThematic: false,
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

const nbRenderCall: number = 1;
const DELAY: number = 50;
describe("Game3DViewComponent", () => {
    let component: Game3DViewComponent;
    let fixture: ComponentFixture<Game3DViewComponent>;
    const mockSocketService: SocketService = new SocketService();
    mockSocketService["socket"] = jasmine.createSpyObj("socket", ["on", "emit"]);
    jasmine.createSpyObj({username: ""});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                Game3DViewComponent,
                ErrorPopupComponent,
                GameMessagesComponent,
                EndingMessageComponent
            ],
            imports: [
                HttpClientModule,
                HttpClientTestingModule,
                RouterTestingModule,
                MatProgressSpinnerModule
            ],
            providers: [
                RenderService,
                ShapeCreatorService,
                AppRoutingModule,
                IndexService,
                MedievalObjectsCreatorService,
                SceneGeneratorService,
                ModalService
            ]
        })
            .compileComponents().then(() => { }, (error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game3DViewComponent);
        component = fixture.componentInstance;
        spyOn(component, "ngOnDestroy").and.callFake(() => {});
        fixture.detectChanges();
        spyOn(component["gameService"], "get3DGame").and.returnValue(Promise.resolve(mockGame3D));
        component["render"]["differencesObjects"] = [];
    });

    it("should create", () => {
        expect(component).toBeTruthy();
        spyOn(component["socket"], "unsubscribeTo").and.callFake(() => {});
    });
    it("once game loaded, should call initialize of render and then adde mouse event to the render", async () => {
        const renderSpy: jasmine.Spy  = spyOn(component["render"], "initialize").and.callThrough();
        // tslint:disable-next-line:no-any
        spyOn((component as any), "sendCreation").and.callFake(() => {});
        // tslint:disable-next-line:no-any
        spyOn((component as any), "startGame").and.callFake(() => {});
        spyOn(component["socket"], "emitEvent").and.callFake(() => {});
        component.get3DGame();
        setTimeout(() => {
            expect(renderSpy).toHaveBeenCalledTimes(nbRenderCall);
        },         DELAY);
    });
    describe("Tests for keyboard events", async () => {
        it("The key W should call the function this.render.moveCam with the parameters z and -this.movementSpeed", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "moveCam").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyW" });
            Object.defineProperty(keyEvent, "keyCode", {
                get : (): number =>  KEYS["W"]
            });
            component["onKeyDown"](keyEvent);
            expect(spy).toHaveBeenCalledWith(AXIS.Z, -component["movementSpeed"]);
        });
        it("The key S should call the function this.render.moveCam with the parameters z and this.movementSpeed", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "moveCam").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyS" });
            Object.defineProperty(keyEvent, "keyCode", {
                get : (): number =>  KEYS["S"]
            });
            component["onKeyDown"](keyEvent);
            expect(spy).toHaveBeenCalledWith(AXIS.Z, component["movementSpeed"]);
        });
        it("The key D should call the function this.render.moveCam with the parameters X and -this.movementSpeed", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "moveCam").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyD" });
            Object.defineProperty(keyEvent, "keyCode", {
                get : (): number =>  KEYS["D"]
            });
            component["onKeyDown"](keyEvent);
            expect(spy).toHaveBeenCalledWith(AXIS.X, component["movementSpeed"]);
        });
        it("The key A should call the function this.render.moveCam with the parameters X and this.movementSpeed", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "moveCam").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyA" });
            Object.defineProperty(keyEvent, "keyCode", {
                get : (): number =>  KEYS["A"]
            });
            component["onKeyDown"](keyEvent);
            expect(spy).toHaveBeenCalledWith(AXIS.X, -component["movementSpeed"]);
        });
        it("The key T should call the function startCheat mode the first time and stopCheatMode the second time", () => {
            const spyStart: jasmine.Spy = spyOn(component["render"], "startCheatMode").and.callFake(() => {});
            const spyStop: jasmine.Spy = spyOn(component["render"], "stopCheatMode").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyT" });
            Object.defineProperty(keyEvent, "keyCode", {
                get : (): number =>  KEYS["T"]
            });
            component["onKeyDown"](keyEvent);
            expect(spyStart).toHaveBeenCalledTimes(1);
            expect(spyStop).toHaveBeenCalledTimes(0);
            component["onKeyDown"](keyEvent);
            expect(spyStart).toHaveBeenCalledTimes(1);
            expect(spyStop).toHaveBeenCalledTimes(1);
        });
    });
    describe("Test for mouse events", () => {
        it("releasing left click should call identifyDiff and send click event", () => {
            const spy: jasmine.Spy = spyOn(component["socket"], "emitEvent");
            const spyDiff: jasmine.Spy = spyOn(component["render"], "identifyDiff").and.callFake(() => {});
            component["onMouseUp"](new MouseEvent("click"));
            expect(spy).toHaveBeenCalled();
            expect(spyDiff).toHaveBeenCalled();
        });
        it("realeasin right click should make that dragging the camera is not possible ", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "rotateCam");
            component["onMouseDown"](new MouseEvent("rightclick", {button: MOUSE.RIGHT}));
            component["onMouseUp"](new MouseEvent("click", {button: MOUSE.RIGHT} ));
            const mouseEventDrag: MouseEvent = new MouseEvent("mousemove");
            component["onMouseMove"](mouseEventDrag);
            expect(spy).toHaveBeenCalledTimes(0);
        });
        it("Right clicking and dragin the mouse should call render.rotateCam two times for X and Y", () => {
            const spy: jasmine.Spy = spyOn(component["render"], "rotateCam");
            const mouseEventClick: MouseEvent = new MouseEvent("rightclick", {button: MOUSE.RIGHT});
            const mouseEventDrag: MouseEvent = new MouseEvent("mousemove");
            component["onMouseDown"](mouseEventClick);
            component["onMouseMove"](mouseEventDrag);
            expect(spy).toHaveBeenCalledWith(AXIS.X, mouseEventDrag.movementY);
            expect(spy).toHaveBeenCalledWith(AXIS.Y, mouseEventDrag.movementX);
        });
    });
    describe("Test for the function handle check differences", () => {
        it("handle check difference should call a function to modify the scene with the parameters passed and play a sound", async () => {
            component.get3DGame();
            const spyDiff: jasmine.Spy = spyOn(component["render"], "removeDiff").and.callFake(() => {});
            const spy: jasmine.Spy = spyOn(component["correctSound"], "play").and.returnValue(Promise.resolve());
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: 3,
                objName: "",
                diffType: "",
                isGameOver: false,
            };
            component["index"]["username"] = update.username;
            component["gamers"] = mockGamers;
            component["handleCheckDifference"](update);
            expect(spyDiff).toHaveBeenCalledWith(update.objName, update.diffType);
            expect(spy).toHaveBeenCalled();
        });
        it("handle check difference receiving 7 differences should finish the game by sending an event to the socket ", async () => {
            spyOn(component["render"], "removeDiff").and.callFake(() => {});
            spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
            component["game3D"] = mockGame3D;
            const spySocket: jasmine.Spy = spyOn(component["socket"], "emitEvent").and.callFake(() => {});
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: 7,
                objName: "",
                diffType: "",
                isGameOver: true,
            };
            component["gamers"] = [mockGamers[0]];
            component["index"]["username"] = update.username;
            component["handleCheckDifference"](update);
            expect(spySocket).toHaveBeenCalled();
        });
        it("handle check difference receiving 7 differences should play the victory sound", async () => {
            const spy: jasmine.Spy = spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
            component["game3D"] = mockGame3D;
            spyOn(component["render"], "removeDiff").and.callFake(() => {});
            spyOn(component["socket"], "emitEvent").and.callFake(() => {});
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: 7,
                objName: "",
                diffType: "",
                isGameOver: true,
            };
            component["gamers"] = [mockGamers[0]];
            component["index"]["username"] = update.username;
            component["handleCheckDifference"](update);
            expect(spy).toHaveBeenCalled();
        });
        it("handle check difference receiving 7 differences should stop the timer and navigate to the games list", async () => {
            spyOn(component["render"], "removeDiff").and.callFake(() => {});
            component["game3D"] = mockGame3D;
            spyOn(component["victorySound"], "play").and.returnValue(Promise.resolve());
            const spy: jasmine.Spy = spyOn(component["router"], "navigate").and.returnValue(Promise.resolve());
            const spyT: jasmine.Spy = spyOn(component["timer"], "stopTimer").and.callFake(() => {});
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: 7,
                objName: "",
                diffType: "",
                isGameOver: true,
            };
            component["gamers"] = [mockGamers[0]];
            component["index"]["username"] = update.username;
            component["handleCheckDifference"](update);
            expect(spy).toHaveBeenCalled();
            expect(spyT).toHaveBeenCalled();
        });
        it("handle check difference receiving -1 differences should play the error sound and show an error popup", async () => {
            spyOn(component["render"], "removeDiff").and.callFake(() => {});
            component["lastClick"] = new MouseEvent("click");
            const spy: jasmine.Spy = spyOn(component["errorSound"], "play").and.returnValue(Promise.resolve());
            const spyE: jasmine.Spy = spyOn(component["errorPopup"], "showPopup").and.callFake(() => {});
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: -1,
                objName: "",
                diffType: "",
                isGameOver: false,
            };
            component["index"]["username"] = update.username;
            component["gamers"] = mockGamers;
            component["handleCheckDifference"](update);
            expect(spy).toHaveBeenCalled();
            expect(spyE).toHaveBeenCalled();
        });
        it("handle check difference receiving -1 differences should NOT play the error sound when its not the right user", async () => {
            spyOn(component["render"], "removeDiff").and.callFake(() => {});
            component["lastClick"] = new MouseEvent("click");
            const spy: jasmine.Spy = spyOn(component["errorSound"], "play").and.returnValue(Promise.resolve());
            const spyE: jasmine.Spy = spyOn(component["errorPopup"], "showPopup").and.callFake(() => {});
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: -1,
                objName: "",
                diffType: "",
                isGameOver: false,
            };
            component["index"]["username"] = "WRONG USER";
            component["gamers"] = mockGamers;
            component["handleCheckDifference"](update);
            expect(spy).toHaveBeenCalledTimes(0);
            expect(spyE).toHaveBeenCalledTimes(0);
        });
        it("handle check difference when no differences are found should disable click for 1sec", async (done) => {
            const update: Game3DRoomUpdate = {
                username: mockGamers[0].username,
                differencesFound: -1,
                objName: "",
                diffType: "",
                isGameOver: false,
            };
            component["lastClick"] = new MouseEvent("click");
            component["index"]["username"] = update.username;
            component["gamers"] = mockGamers;
            component["handleCheckDifference"](update);
            expect(component.disableClick).toEqual("disable-click");
            expect(component.blockedCursor).toEqual("cursor-not-allowed");
            setTimeout(() => {
                expect(component.disableClick).toEqual("");
                expect(component.blockedCursor).toEqual("");
                done();
            },         component["CLICK_DELAY"] + 1);
        });
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
    it("should call the modal soloEndGame from the modalService", () => {
        const spyEndGame: jasmine.Spy = spyOn(component["modalService"], "open");
        expect(spyEndGame).toHaveBeenCalledWith("soloEndGame");
        component.openEndingDialog("soloEndGame");
    });
// tslint:disable-next-line:max-file-line-count
});
