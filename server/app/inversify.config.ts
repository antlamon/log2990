import { Container } from "inversify";
import { Application } from "./app";
import { ConnexionController } from "./controllers/connexion.controller";
import { GameListController } from "./controllers/game-list.controller";
import { IdentificationController } from "./controllers/identification.controller";
import { ImageController } from "./controllers/image.controller";
import { Server } from "./server";
import { ConnexionService } from "./services/connexion.service";
import { ConvertImage } from "./services/convertImage.service";
import { DatabaseService } from "./services/database.service";
import { FormValidatorService } from "./services/formValidator.service";
import { GameListService } from "./services/game-list.service";
import { Game3DGeneratorService } from "./services/game3DGenerator.service";
import { Game3DModificatorService } from "./services/game3DModificator.service";
import { GameRoomService } from "./services/gameRoom.service";
import { IdentificationServiceManager } from "./services/identification.service.manager";
import { ImageService } from "./services/image.service";
import { ObjectGeneratorService } from "./services/objectGenerator.service";
import { UsersManager } from "./services/users.service";
import { SocketServerManager } from "./socket/socketServerManager";
import { TYPES } from "./types";
import { GameMessageController } from "./controllers/game-message.controller";
import { GameMessageService } from "./services/game-message.service";

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

container.bind(TYPES.Game3DGeneratorService).to(Game3DGeneratorService);
container.bind(TYPES.Game3DModificatorService).to(Game3DModificatorService);
container.bind(TYPES.ObjectGeneratorService).to(ObjectGeneratorService);

container.bind(TYPES.UserManager).to(UsersManager).inSingletonScope();
container.bind(TYPES.SocketServerManager).to(SocketServerManager).inSingletonScope();
container.bind(TYPES.DatabaseService).to(DatabaseService).inSingletonScope();

container.bind(TYPES.IdentificationController).to(IdentificationController);
container.bind(TYPES.IdentificationServiceManager).to(IdentificationServiceManager);

container.bind(TYPES.GameRoomService).to(GameRoomService);
container.bind(TYPES.FormValidatorService).to(FormValidatorService);

container.bind(TYPES.GameMessageController).to(GameMessageController);
container.bind(TYPES.GameMessageService).to(GameMessageService);

export { container };
