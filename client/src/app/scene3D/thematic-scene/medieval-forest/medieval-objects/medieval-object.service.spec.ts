import { TestBed } from "@angular/core/testing";

import { MedievalObjectService } from "./medieval-object.service";

describe("MedievalObjectService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: MedievalObjectService = TestBed.get(MedievalObjectService);
    expect(service).toBeTruthy();
  });
});
