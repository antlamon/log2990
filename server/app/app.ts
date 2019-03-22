import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import { ConnexionController } from "./controllers/connexion.controller";
import { GameListController } from "./controllers/game-list.controller";
import { IdentificationController } from "./controllers/identification.controller";
import { ImageController } from "./controllers/image.controller";
import { TYPES } from "./types";
import { GameMessageController } from "./controllers/game-message.controller";

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(
            @inject(TYPES.ConnexionController) private connexionController: ConnexionController,
            @inject(TYPES.ImageController) private imageController: ImageController,
            @inject(TYPES.GameListController) private gameListController: GameListController,
            @inject(TYPES.IdentificationController) private identificationController: IdentificationController,
            @inject(TYPES.GameMessageController) private gameMessageController: GameMessageController) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json({limit: "50mb"}));
        this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        // Notre application utilise le routeur de notre API
        this.app.use(this.connexionController.URL, this.connexionController.router);
        this.app.use(ImageController.URL, this.imageController.router);
        this.app.use(this.gameListController.URL, this.gameListController.router);
        this.app.use(IdentificationController.URL, this.identificationController.router);
        this.app.use(this.gameMessageController.URL, this.gameMessageController.router);
        this.errorHandeling();
    }

    private errorHandeling(): void {
        this.app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
            const err: Error = new Error("Not Found");
            next(err);
        });

        // development error handler
        // will print stacktrace
        if (this.app.get("env") === "development") {
            // tslint:disable-next-line:no-any
            this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
                res.status(err.status || this.internalError);
                res.send({
                    message: err.message,
                    error: err,
                });
            });
        }

        // production error handler
        // no stacktraces leaked to user (in production env only)
        // tslint:disable-next-line:no-any
        this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.status(err.status || this.internalError);
            res.send({
                message: err.message,
                error: {},
            });
        });
    }
}
