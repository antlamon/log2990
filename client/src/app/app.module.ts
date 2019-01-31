import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppComponent } from "./app.component";
import { HttpClientModule } from "@angular/common/http";
import { InitialComponent } from "./initial/initial.component";
import { AdminMenuComponent } from "./adminView/admin-menu/admin-menu.component";
import { FreeGeneratorComponent } from "./adminView/free-generator/free-generator.component";
import { SimpleGeneratorComponent } from "./adminView/simple-generator/simple-generator.component";
import { AppRoutingModule } from "./app-routing.module";
import { FormsModule } from "@angular/forms";
import { IndexService } from "./index.service";
import { ListViewComponent } from './list-view/list-view.component';
import {SocketService} from "./socket.service";

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    AdminMenuComponent,
    FreeGeneratorComponent,
    SimpleGeneratorComponent,
    ListViewComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
  ],
  providers: [IndexService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
