import { TestBed } from "@angular/core/testing";
import { SceneBuilderService } from "./scene-builder.service";

describe("SceneBuilderService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SceneBuilderService = TestBed.get(SceneBuilderService);
    expect(service).toBeTruthy();
  });
});
