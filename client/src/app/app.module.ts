import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { BasicService } from "./basic.service";
import { HttpClientModule } from "@angular/common/http";
import { InitialComponent } from './initial/initial.component';
<<<<<<< HEAD
import { AdminMenuComponent } from './adminView/admin-menu/admin-menu.component';
import { FreeGeneratorComponent } from './adminView/free-generator/free-generator.component';
import { SimpleGeneratorComponent } from './adminView/simple-generator/simple-generator.component';
import { AppRoutingModule } from './/app-routing.module';
import { FormsModule } from '@angular/forms';

=======
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './/app-routing.module';
>>>>>>> 3f726d2e4737c25e09435c7e688bf6e7e41a1860

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    AdminMenuComponent,
    FreeGeneratorComponent,
    SimpleGeneratorComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [BasicService],
  bootstrap: [AppComponent]
})
export class AppModule { }
