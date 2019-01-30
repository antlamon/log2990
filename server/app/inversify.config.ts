import { Container } from "inversify";
import { Application } from "./app";
import { DateController } from "./controllers/date.controller";
import { ImageController } from "./controllers/image.controller";
import { IndexController } from "./controllers/index.controller";
import { Server } from "./server";
import { DateService } from "./services/date.service";
import { IndexService } from "./services/index.service";
import { TYPES } from "./types";

import {ConnexionController} from "./controllers/connexion.controller";
import { ApplicationInterface,
         ConvertImageServiceInterface,
         DateControllerInterface,
         DateServiceInterface,
         ImageControllerInterface,
         ImageServiceInterface,
         IndexControllerInterface,
         IndexServiceInterface,
         ServerInterface} from "./interfaces";
import {ConnexionService} from "./services/connexion.service";
import { ConvertImage } from "./services/convertImage.service";
import { ImageService } from "./services/image.service";

const container: Container = new Container();

container.bind<ServerInterface>(TYPES.ServerInterface).to(Server);
container.bind<ApplicationInterface>(TYPES.ApplicationInterface).to(Application);
container.bind<IndexControllerInterface>(TYPES.IndexControllerInterface).to(IndexController);
container.bind<IndexServiceInterface>(TYPES.IndexServiceInterface).to(IndexService);

container.bind<DateControllerInterface>(TYPES.DateControllerInterface).to(DateController);
container.bind<DateServiceInterface>(TYPES.DateServiceInterface).to(DateService);

container.bind<ImageControllerInterface>(TYPES.ImageControllerInterface).to(ImageController);
container.bind<ImageServiceInterface>(TYPES.ImageServiceInterface).to(ImageService);
container.bind<ConvertImageServiceInterface>(TYPES.ConvertImageServiceInterface).to(ConvertImage);

container.bind(TYPES.ConnexionService).to(ConnexionService);
container.bind(TYPES.ConnexionController).to(ConnexionController);

export { container };
