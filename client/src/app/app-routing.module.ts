import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import { ListViewComponent } from "./list-view/list-view.component";
import {InitialComponent} from "./initial/initial.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import {Scene3DComponent} from "./scene3D/scene3-d/scene3-d.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";

const routes: Routes = [
  { path: "admin", component: AdminMenuComponent },
  { path: "games", component: ListViewComponent },
  { path: "", component: InitialComponent },
  { path: "simple-game/:id", component: Game2DViewComponent },
  { path: "3d-game/:id", component: Game3DViewComponent },
  { path: "view3D", component: Scene3DComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
