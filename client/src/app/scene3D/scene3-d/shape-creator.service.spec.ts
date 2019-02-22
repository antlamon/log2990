import { TestBed, async } from "@angular/core/testing";

import { ShapeCreatorService } from "./shape-creator.service";

describe("ShapeCreatorService", () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShapeCreatorService ],
      providers: [ ShapeCreatorService ]
    })
    .compileComponents();
  }));

});
