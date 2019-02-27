import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { Game3DViewComponent } from "./game3D-view.component";
import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import { RenderService } from "src/app/scene3D/scene3-d/render.service";
import { ShapeCreatorService } from "src/app/scene3D/scene3-d/shape-creator.service";
import { IObjet3D } from "../../../../../common/models/objet3D";
import { IScene3D } from "../../../../../common/models/game3D";
const mockObjects: IObjet3D[] = [];
const mockOkScene: IScene3D = {
  modified: false,
  numObj: mockObjects.length,
  objects: mockObjects,
  backColor: 0xFF0F0F,
};
const nbRenderCall: number = 2;
const delay: number = 10;
describe("Game3DViewComponent", () => {
    let component: Game3DViewComponent;
    let fixture: ComponentFixture<Game3DViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [Game3DViewComponent],
            imports: [HttpClientModule, RouterModule.forRoot([])],
            providers: [RenderService, ShapeCreatorService]
        })
            .compileComponents().then(() => { }, (error: Error) => {
                console.error(error);
            });
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(Game3DViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
        spyOn(component["gameService"], "get3DGame").and.returnValue(Promise.resolve(mockOkScene));
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
