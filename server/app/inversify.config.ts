import { Container } from "inversify";
import { Application } from "./app";
import { ConnexionController } from "./controllers/connexion.controller";
import { ImageController } from "./controllers/image.controller";
import { Server } from "./server";
import { ConnexionService } from "./services/connexion.service";
import { ConvertImage } from "./services/convertImage.service";
import { ImageService } from "./services/image.service";
import { UsersManager } from "./services/users.service";
import { SocketServerManager } from "./socketServerManager";
import { TYPES } from "./types";

const container: Container = new Container();

container.bind(TYPES.Server).to(Server);
container.bind(TYPES.Application).to(Application);

container.bind(TYPES.ImageController).to(ImageController);
container.bind(TYPES.ImageService).to(ImageService);
container.bind(TYPES.ConvertImage).to(ConvertImage);

container.bind(TYPES.ConnexionService).to(ConnexionService);
container.bind(TYPES.ConnexionController).to(ConnexionController);

container.bind(TYPES.UserManager).to(UsersManager).inSingletonScope();
container.bind(TYPES.SocketServerManager).to(SocketServerManager);

export { container };
