import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ThematicSceneComponent } from "./thematic-scene.component";
import { MedievalForestService } from "./medieval-forest/medieval-forest.service";
import { MedievalObjectService } from "./medieval-forest/medieval-objects/medieval-object.service";

describe("ThematicSceneComponent", () => {
  let component: ThematicSceneComponent;
  let fixture: ComponentFixture<ThematicSceneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThematicSceneComponent ],
      providers: [ MedievalForestService, MedievalObjectService ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThematicSceneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
