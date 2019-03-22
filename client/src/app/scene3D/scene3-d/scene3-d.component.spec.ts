import { async, TestBed, ComponentFixture } from "@angular/core/testing";
import { Scene3DComponent } from "./scene3-d.component";
import { RenderService } from "./render.service";
import { ShapeCreatorService } from "./shape-creator.service";
import { IGame3D } from "../../../../../common/models/game3D";
import { IObjet3D } from "../../../../../common/models/objet3D";

describe("Scene3DComponent", () => {
  let component: Scene3DComponent;
  let fixture: ComponentFixture<Scene3DComponent>;
  const obj3D: IObjet3D = {
    type: "cube",
    color: 0,
    texture: "",
    position: { x: 0, y: 0, z: 0},
    size: 0.7,
    rotation: {x: 0, y: 0, z: 0},
    name: ""
};

  const mockGame: IGame3D = {
  name: "mock",
  id: "mockid",
  originalScene: [obj3D],
  solo: [],
  multi: [],
  differences: [],
  backColor: 0,
  isThematic: false,
};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Scene3DComponent],
      providers: [RenderService, ShapeCreatorService],
    })
      .compileComponents().then(() => { }, (error: Error) => {});
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Scene3DComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should be created", () => {
    expect(component).toBeTruthy();
  });

  it("should be created with cardMode false", () => {
    expect(component["isCardMode"]).toEqual(false);
  });

  describe("Test for display mode : card or no card. ", () => {
    it("should not display the 3DScene if in cardMode", () => {
      component["isCardMode"] = true;
      component.ngAfterViewInit();
      expect(component["container"].style.display).toEqual("none");
    });
    it("should display the 3DScene if not in cardMode", () => {
      component["isCardMode"] = false;
      component.ngAfterViewInit();
      expect(component["container"].style.display).toEqual("block");
    });
  });
  describe("Test for the resize event.", () => {
    it("should call render function Onresize when window is resized", () => {
      const spyResize: jasmine.Spy = spyOn(component["renderService"], "onResize");
      component.onResize();
      expect(spyResize).toHaveBeenCalled();
    });
  });
  describe("Test for the controlled calls to the renderer. ", () => {
    it("should not call the scene renderer if no game is given", () => {
      component["game"] = undefined;
      const spyInitialize: jasmine.Spy = spyOn(component["renderService"], "initialize");
      component.ngAfterViewInit();
      expect(spyInitialize).toHaveBeenCalledTimes(0);
    });
    it("should call the scene renderer if valid game is given", () => {
      component["game"] = mockGame;
      const dummyCanva: HTMLCanvasElement = document.createElement("canvas");
      component["container"].appendChild(dummyCanva);
      const spyInitialize: jasmine.Spy = spyOn(component["renderService"], "initialize");
      component.ngAfterViewInit();
      expect(spyInitialize).toHaveBeenCalled();
    });
  });

});
