import { TestBed, async, ComponentFixture } from "@angular/core/testing";
import { RenderService } from "./render.service";

describe("renderService", () => {
  let component: RenderService;
  let fixture: ComponentFixture<RenderService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RenderService ],
      providers: [RenderService]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RenderService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe("Test for the function random", () => {
    it("should return a number between the max / min paremeters (included)", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
  });
  describe("Test for calls within the initialize function", () => {
    it("should call generate map", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call createScene", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call create shape the correct amount of time", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call the renderingLoop", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call the render function via renderingLoop", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
  });
  describe("Test for calls within the initialize function", () => {
    it("should call generate map", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call createScene", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call create shape the correct amount of time", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call the renderingLoop", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
    it("should call the render function via renderingLoop", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
  });

  it("should call create shape the correct amount of time", () => {
    const max: number = 1, min: number = 0;
    const nb: number = component.random(min, max);
    expect(nb).toBeGreaterThanOrEqual(min);
    expect(nb).toBeLessThanOrEqual(max);
  });
  it("should call the renderingLoop", () => {
    const max: number = 1, min: number = 0;
    const nb: number = component.random(min, max);
    expect(nb).toBeGreaterThanOrEqual(min);
    expect(nb).toBeLessThanOrEqual(max);
  });
  it("should call the render function via renderingLoop", () => {
    const max: number = 1, min: number = 0;
    const nb: number = component.random(min, max);
    expect(nb).toBeGreaterThanOrEqual(min);
    expect(nb).toBeLessThanOrEqual(max);
  });
  describe("Test for the object validation within create scene", () => {
    it("should call generate map", () => {
      const max: number = 1, min: number = 0;
      const nb: number = component.random(min, max);
      expect(nb).toBeGreaterThanOrEqual(min);
      expect(nb).toBeLessThanOrEqual(max);
    });
  });
});
