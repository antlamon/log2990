import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { AdminMenuComponent } from './adminView/admin-menu/admin-menu.component';
import { FreeGeneratorComponent } from './adminView/free-generator/free-generator.component';
import { SimpleGeneratorComponent} from './adminView/simple-generator/simple-generator.component';

const routes: Routes = [
  { path: 'admin', component: AdminMenuComponent},
  { path: 'freegen', component: FreeGeneratorComponent},
  { path: 'simplegen', component: SimpleGeneratorComponent},
];


@NgModule({
  imports:[ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ],  declarations: []
})
export class AppRoutingModule { }
