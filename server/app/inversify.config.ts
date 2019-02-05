import { Container } from "inversify";
import { Application } from "./app";
import { ConnexionController } from "./controllers/connexion.controller";
import { GameListController } from "./controllers/game-list.controller";
import { ImageController } from "./controllers/image.controller";
import { Server } from "./server";
import { ConnexionService } from "./services/connexion.service";
import { ConvertImage } from "./services/convertImage.service";
import { GameListService } from "./services/game-list.service";
import { ImageService } from "./services/image.service";
import { UsersManager } from "./services/users.service";
import { SocketServerManager } from "./socket/socketServerManager";
import { TYPES } from "./types";

const container: Container = new Container();

container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);

container.bind(TYPES.ImageController).to(ImageController);
container.bind(TYPES.ImageService).to(ImageService);
container.bind(TYPES.ConvertImage).to(ConvertImage);

container.bind(TYPES.ConnexionService).to(ConnexionService);
container.bind(TYPES.ConnexionController).to(ConnexionController);

container.bind(TYPES.GameListController).to(GameListController);
container.bind(TYPES.GameListService).to(GameListService);

container.bind(TYPES.UserManager).to(UsersManager).inSingletonScope();
container.bind(TYPES.SocketServerManager).to(SocketServerManager).inSingletonScope();

export { container };
