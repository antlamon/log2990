import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { FreeGeneratorComponent } from './free-generator.component';
import { AdminMenuComponent } from '../admin-menu/admin-menu.component';
import { SimpleGeneratorComponent } from '../simple-generator/simple-generator.component';

describe("FreeGeneratorComponent", () => {
  let component: FreeGeneratorComponent;
  let fixture: ComponentFixture<FreeGeneratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FreeGeneratorComponent, AdminMenuComponent, SimpleGeneratorComponent ],
      imports: [ AppRoutingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeGeneratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
