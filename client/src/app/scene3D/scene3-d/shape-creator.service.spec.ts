import { TestBed } from "@angular/core/testing";

import { ShapeCreatorService } from "./shape-creator.service";

describe("ShapeCreatorService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: ShapeCreatorService = TestBed.get(ShapeCreatorService);
    expect(service).toBeTruthy();
  });
});
