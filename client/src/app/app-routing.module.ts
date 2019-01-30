import { NgModule } from "@angular/core";
import { RouterModule, Routes, Route } from "@angular/router";

import { AdminMenuComponent } from "./adminView/admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "./adminView/free-generator/free-generator.component";
import { SimpleGeneratorComponent } from "./adminView/simple-generator/simple-generator.component";
import { InitialComponent } from "./initial/initial.component";

const routes: Routes = [
  {
    path: "admin",
    component: AdminMenuComponent,
    children: [
      { path: "freegen", component: FreeGeneratorComponent } as Route,
      { path: "simplegen", component: SimpleGeneratorComponent } as Route,
    ]
  },
  { path: "", component: InitialComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule], declarations: []
})
export class AppRoutingModule { }
