import { NgModule } from "@angular/core";
import { RouterModule, Routes} from "@angular/router";
import {AdminMenuComponent} from "./adminView/admin-menu/admin-menu.component";
import {InitialComponent} from "./initial/initial.component";
import { ListViewComponent } from "./list-view/list-view.component";

const routes: Routes = [
  { path: 'admin',
    component: AdminMenuComponent,
  },
  { path: "", component: InitialComponent },
  { path: "games", component: ListViewComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
