import { TestBed } from "@angular/core/testing";

import { ModelsGeneratorService } from "./models-generator.service";

describe("ModelsGeneratorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ModelsGeneratorService = TestBed.get(ModelsGeneratorService);
    expect(service).toBeTruthy();
  });
});
