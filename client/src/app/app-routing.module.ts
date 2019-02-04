import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import { ListViewComponent } from "./list-view/list-view.component";
import {InitialComponent} from "./initial/initial.component";

const routes: Routes = [
  { path: 'admin',
    component: AdminMenuComponent,
  },
  { path: "games", component: ListViewComponent },
  {path:"", component:InitialComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
