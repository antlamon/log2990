import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import { ListViewComponent } from "./list-view/list-view.component";
import {InitialComponent} from "./initial/initial.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { ThematicSceneComponent } from "./scene3D/thematic-scene/thematic-scene.component";
import { Scene3DComponent } from "./scene3D/geometric-scene/scene3-d.component";

const routes: Routes = [
  { path: "admin", component: AdminMenuComponent },
  { path: "games", component: ListViewComponent },
  { path: "", component: InitialComponent },
  { path: "simple-game/:id", component: Game2DViewComponent },
  { path: "free-game/:id", component: Game3DViewComponent },
  { path: "models", component: ThematicSceneComponent },
  { path: "test", component: Scene3DComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
