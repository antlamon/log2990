import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import { ListViewComponent } from "./list-view/list-view.component";
import {InitialComponent} from "./initial/initial.component";
import { Game2DViewComponent } from "./gameView/game2D-view/game2D-view.component";
import { Game3DViewComponent } from "./gameView/game3D-view/game3D-view.component";
import { WaitingComponent } from "./waiting/waiting.component";
import {GAMES_LIST_PATH, INITIAL_PATH, SIMPLE_GAME_PATH, FREE_GAME_PATH, ADMIN_PATH, WAITING_PATH} from "../app/global/constants";
const routes: Routes = [
  { path: ADMIN_PATH, component: AdminMenuComponent },
  { path: GAMES_LIST_PATH, component: ListViewComponent },
  { path: INITIAL_PATH, component: InitialComponent },
  { path: SIMPLE_GAME_PATH + ":id", component: Game2DViewComponent },
  { path: FREE_GAME_PATH + ":id", component: Game3DViewComponent },
  { path: WAITING_PATH + ":id", component: WaitingComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
