import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import { ListViewComponent } from "./list-view/list-view.component";
import {InitialComponent} from "./initial/initial.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { WaitingComponent } from "./waiting/waiting.component";

const routes: Routes = [
  { path: "admin", component: AdminMenuComponent },
  { path: "games", component: ListViewComponent },
  { path: "", component: InitialComponent },
  { path: "simple-game/:id", component: Game2DViewComponent },
  { path: "free-game/:id", component: Game3DViewComponent },
  { path: "waiting/:id", component: WaitingComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
