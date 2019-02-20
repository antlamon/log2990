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
import { IndexService } from "./services/index.service";
import { ListViewComponent } from "./list-view/list-view.component";
import {SocketService} from "./services/socket.service";
import {MatCardModule} from "@angular/material/card";
import { MatDialogModule } from "@angular/material";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { ModalService } from "./services/modal.service";
import { FileValidatorService } from "./services/file-validator.service";
import { GameViewComponent } from "./gameView/game-view/game-view.component";
import { RouterModule } from "@angular/router";
import { Scene3DComponent } from "./scene3D/scene3-d/scene3-d.component";
import { RenderService } from "./scene3D/scene3-d/render.service";
import { Game3DComponent } from "./scene3D/game3-d/game3-d.component";
import { ShapeCreatorService } from "./scene3D/scene3-d/shape-creator.service";

@NgModule({
  declarations: [
    AppComponent,
    InitialComponent,
    AdminMenuComponent,
    FreeGeneratorComponent,
    ListViewComponent,
    SimpleGeneratorComponent,
    GameViewComponent,
    Scene3DComponent,
    Game3DComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    MatCardModule,
    MatDialogModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([]),
  ],
  entryComponents: [
    SimpleGeneratorComponent,
    FreeGeneratorComponent,
  ],
  providers: [
    IndexService,
    SocketService,
    ModalService,
    FileValidatorService,
    RenderService,
    ShapeCreatorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
