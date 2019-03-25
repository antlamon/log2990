import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game3DViewComponent } from "./game3D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { RenderService } from "src/app/scene3D/scene3-d/render.service";
import { ShapeCreatorService } from "src/app/scene3D/scene3-d/shape-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { IGame3D, IDifference } from "../../../../../common/models/game3D";
import { AppRoutingModule } from "src/app/app-routing.module";
import { MatProgressSpinnerModule } from "@angular/material";
import { IScore } from "../../../../../common/models/top3";
import { IndexService } from "src/app/services/index.service";
//import { KEYS } from "src/app/global/constants";
import { SocketService } from "src/app/services/socket.service";
import { KEYS } from "src/app/global/constants";
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

const nbRenderCall: number = 1;
const delay: number = 10;
describe("Game3DViewComponent", () => {
    let component: Game3DViewComponent;
    let fixture: ComponentFixture<Game3DViewComponent>;
    const mockSocketService: SocketService = new SocketService();
    mockSocketService["socket"] = jasmine.createSpyObj("socket", ["on", "emit"]);
    jasmine.createSpyObj({username: ""});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Game3DViewComponent],
            imports: [HttpClientModule, RouterTestingModule, MatProgressSpinnerModule],
            providers: [RenderService, ShapeCreatorService, AppRoutingModule, IndexService]
        })
            .compileComponents().then(() => { }, (error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game3DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component["gameService"], "get3DGame").and.returnValue(Promise.resolve(mockGame3D));
    });

    it("should create", () => {
        expect(component).toBeTruthy();
    });
    it("once game loaded, should call initialize of render", async () => {
        const renderSpy: jasmine.Spy  = spyOn(component["render"], "initialize");
        component.get3DGame();
        setTimeout(() => {
            expect(renderSpy).toHaveBeenCalledTimes(nbRenderCall);
        },         delay);
    });
    describe("Tests for keyboard events", async () => {
        it("The key w should call the function this.render.moveCam with the parameters z and -this.movementSpeed", () => {
            spyOn(component["render"], "moveCam").and.callFake(() => {});
            const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyW" });
            Object.defineProperty(keyEvent, "keyCode", {
            get : (): number =>  KEYS["W"]
            });
            component["onKeyDown"](keyEvent);
            expect(spyOn).toHaveBeenCalled();
        });
    });
    // describe("Tests for keyboard events", async () => {
    //     it("The key w should call the function this.camera.translateZ with: -this.movementSpeed has parameters", () => {
    //       const spy: jasmine.Spy = spyOn(component["camera"], "translateZ").and.callFake(() => {});
    //       const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyW" });
    //       Object.defineProperty(keyEvent, "keyCode", {
    //         get : (): number => {
    //           return KEYS["W"];
    //         }
    //       });
    //       component["onKeyDown"](keyEvent);
    //       expect(spy).toHaveBeenCalledWith(-component["movementSpeed"]);
    //     });
    //     it("The key s should call the function this.camera.translateZ with: this.movementSpeed has parameters", () => {
    //       const spy: jasmine.Spy = spyOn(component["camera"], "translateZ").and.callFake(() => {});
    //       const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyS" });
    //       Object.defineProperty(keyEvent, "keyCode", {
    //         get : (): number => {
    //           return KEYS["S"];
    //         }
    //       });
    //       component["onKeyDown"](keyEvent);
    //       expect(spy).toHaveBeenCalledWith(component["movementSpeed"]);
    //     });
    //     it("The key a should call the function this.camera.translateX with: -this.movementSpeed has parameters", () => {
    //       const spy: jasmine.Spy = spyOn(component["camera"], "translateX").and.callFake(() => {});
    //       const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyW" });
    //       Object.defineProperty(keyEvent, "keyCode", {
    //         get : (): number => {
    //           return KEYS["A"];
    //         }
    //       });
    //       component["onKeyDown"](keyEvent);
    //       expect(spy).toHaveBeenCalledWith(-component["movementSpeed"]);
    //     });
    //     it("The key d should call the function this.camera.translateX with: this.movementSpeed has parameters", () => {
    //       const spy: jasmine.Spy = spyOn(component["camera"], "translateX").and.callFake(() => {});
    //       const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyW" });
    //       Object.defineProperty(keyEvent, "keyCode", {
    //         get : (): number => {
    //           return KEYS["D"];
    //         }
    //       });
    //       component["onKeyDown"](keyEvent);
    //       expect(spy).toHaveBeenCalledWith(component["movementSpeed"]);
    //     });
    //     describe("Test for the cheat functions", () => {
    //       it("The key T should call startCheatMode and pressing a second time should stop it", async () => {
    //         await component.initialize(container1, container2, mockGame);
    //         const keyEvent: KeyboardEvent = new KeyboardEvent("keydown", { code: "keyT" });
    //         Object.defineProperty(keyEvent, "keyCode", {
    //         get : (): number => {
    //           return KEYS["T"];
    //         }
    //       });
    //       component["differences"] = [];
    //       component["onKeyDown"](keyEvent);
    //         expect(component["cheatModeActivated"]).toEqual(true);
    //         component["onKeyDown"](keyEvent);
    //         expect(component["cheatModeActivated"]).toEqual(false);
    //       });
    //     });
    //   });
});
