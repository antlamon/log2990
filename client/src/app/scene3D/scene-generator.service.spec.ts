import { TestBed } from "@angular/core/testing";

import { SceneGeneratorService } from "./scene-generator.service";

describe("SceneGeneratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: SceneGeneratorService = TestBed.get(SceneGeneratorService);
    expect(service).toBeTruthy();
  });
});
