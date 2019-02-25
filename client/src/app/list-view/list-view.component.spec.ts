import { async, ComponentFixture, TestBed } from "@angular/core/testing";
import { ListViewComponent } from "./list-view.component";
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "../app-routing.module";
import { AdminMenuComponent } from "../adminView/admin-menu/admin-menu.component";
import { InitialComponent } from "../initial/initial.component";
import { Game2DViewComponent } from "../gameView/game2D-view/game2D-view.component";
import { SimpleGeneratorComponent } from "../adminView/simple-generator/simple-generator.component";
import { FreeGeneratorComponent } from "../adminView/free-generator/free-generator.component";
import { FormsModule } from "@angular/forms";
import { Scene3DComponent } from "../scene3D/scene3-d/scene3-d.component";
import { IGame } from "../../../../common/models/game";
import { ITop3 } from "../../../../common/models/top3";
import { Game3DViewComponent } from "../gameView/game3D-view/game3D-view.component";

describe("ListViewComponent", () => {
  let component: ListViewComponent;
  let fixture: ComponentFixture<ListViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        AppRoutingModule,
        FormsModule
      ],
      declarations: [
        ListViewComponent,
        AdminMenuComponent,
        InitialComponent,
        Game2DViewComponent,
        SimpleGeneratorComponent,
        FreeGeneratorComponent,
        Scene3DComponent,
        Game3DViewComponent
      ]
    })
      .compileComponents().then(() => { }, (error: Error) => { });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });

  it("should route to game Play with the proper iD", () => {
    const routeSpy: jasmine.Spy = spyOn(component["router"], "navigate");
    const game: IGame = {
      id: "",
      name: "string",
      originalImageURL: "string",
      solo: {} as ITop3,
      multi:  {} as ITop3
    };
    component.playSelectedSimpleGame(game);
    expect(routeSpy).toHaveBeenCalledWith(["simple-game/" + game.id]);
  });

});
