import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { IndexController } from "./controllers/index.controller";
import { IndexService } from "./services/index.service";
import { DateController } from "./controllers/date.controller";
import { DateService } from "./services/date.service";
import { ImageController } from "./controllers/image.controller";
import { ImageService } from "./services/image.service";
import { ConvertImage } from "./services/convertImage.service";


const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.IndexController).to(IndexController);
container.bind(Types.IndexService).to(IndexService);

container.bind(Types.DateController).to(DateController);
container.bind(Types.DateService).to(DateService);
container.bind(Types.ImageController).to(ImageController);
container.bind(Types.ImageService).to(ImageService);
container.bind(Types.ConvertImage).to(ConvertImage);


export { container };
