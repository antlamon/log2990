import { Container } from "inversify";
import { TYPES } from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { IndexController } from "./controllers/index.controller";
import { DateController } from "./controllers/date.controller";
import { IndexService } from "./services/index.service";
import { DateService } from "./services/date.service";
import { ImageController } from "./controllers/image.controller";
import { GameListController} from "./controllers/game-list.controller";
import { GameListService} from "./services/game-list.service";


import { DateServiceInterface,
         IndexServiceInterface,
         DateControllerInterface, 
         IndexControllerInterface,
         ImageControllerInterface, 
         ServerInterface,
         ApplicationInterface, 
         ImageServiceInterface,
         ConvertImageServiceInterface} from "./interfaces";
import { ImageService } from "./services/image.service";
import { ConvertImage } from "./services/convertImage.service";
import {ConnexionController} from "./controllers/connexion.controller";
import {ConnexionService} from "./services/connexion.service";

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

container.bind(TYPES.GameListController).to(GameListController);
container.bind(TYPES.GameListService).to(GameListService);


export { container };
