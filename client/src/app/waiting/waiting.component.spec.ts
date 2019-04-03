import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { WaitingComponent } from "./waiting.component";
import { RouterTestingModule } from "@angular/router/testing";
import { AppRoutingModule } from "../app-routing.module";
import { IndexService } from "../services/index.service";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { HttpClientModule } from "@angular/common/http";

describe("WaitingComponent", () => {
  let component: WaitingComponent;
  let fixture: ComponentFixture<WaitingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaitingComponent ],
      imports: [RouterTestingModule, HttpClientModule
        ,       HttpClientTestingModule],
      providers: [ AppRoutingModule, IndexService ],
    })
    .compileComponents().then(() => { }, (error: Error) => {
      console.error(error);
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaitingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
