import { async, inject, TestBed } from "@angular/core/testing";

import { MedievalForestService } from "./medieval-forest.service";
import { MedievalObjectService } from "./medieval-objects/medieval-object.service";

describe("MedievalForestService", () => {

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [ MedievalForestService, MedievalObjectService ]
    })
    .compileComponents();
  }));

  it("should be created", inject([MedievalForestService], (service: MedievalForestService) => {
    expect(service).toBeTruthy();
  }));
});
