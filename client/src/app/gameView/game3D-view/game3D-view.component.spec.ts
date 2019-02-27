import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game3DViewComponent } from "./game3D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterTestingModule } from "@angular/router/testing";
import { RenderService } from "src/app/scene3D/scene3-d/render.service";
import { ShapeCreatorService } from "src/app/scene3D/scene3-d/shape-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { IScene3D, IGame3D } from "../../../../../common/models/game3D";
import { ITop3 } from "../../../../../common/models/top3";
import { AppRoutingModule } from "src/app/app-routing.module";
const mockObjects: IObjet3D[] = [];
const mockOkScene: IScene3D = {
  modified: false,
  numObj: mockObjects.length,
  objects: mockObjects,
  backColor: 0xFF0F0F,
};

const mockGame3D: IGame3D = {
    name: "mock3DName",
    id: "dskjahd",
    originalScene: mockOkScene,
    modifiedScene: mockOkScene,
    solo: { } as ITop3,
    multi: { } as ITop3,
  };

const nbRenderCall: number = 2;
const delay: number = 10;
describe("Game3DViewComponent", () => {
    let component: Game3DViewComponent;
    let fixture: ComponentFixture<Game3DViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Game3DViewComponent],
            imports: [HttpClientModule, RouterTestingModule],
            providers: [RenderService, ShapeCreatorService, AppRoutingModule]
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
});
