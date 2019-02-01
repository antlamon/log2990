import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as cors from "cors";
import * as express from "express";
import { inject, injectable } from "inversify";
import * as logger from "morgan";
import { ConnexionController } from "./controllers/connexion.controller";
import { DateController } from "./controllers/date.controller";
import { GameListController } from "./controllers/game-list.controller";
import { ImageController } from "./controllers/image.controller";
import { IndexController } from "./controllers/index.controller";
import { TYPES } from "./types";

@injectable()
export class Application implements ApplicationInterface {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(
            @inject(TYPES.IndexController) private indexController: IndexController,
            @inject(TYPES.DateController) private dateController: DateController,
            @inject(TYPES.ConnexionController)private connexionController: ConnexionController,
            @inject(TYPES.ImageController) private imageController: ImageController,
            @inject(TYPES.GameListController) private gameListController: GameListController) {
        this.app = express();
        this.config();
        this.bindRoutes();
    }

    private config(): void {
        // Middlewares configuration
        this.app.use(logger("dev"));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(cookieParser());
        this.app.use(cors());
    }

    public bindRoutes(): void {
        // Notre application utilise le routeur de notre API `Index`
        this.app.use("/api/connexion", this.connexionController.router);
        this.app.use("/api/index", this.indexController.router);
        this.app.use("/api/date/", this.dateController.router);
        this.app.use(this.imageController.url, this.imageController.router);
        this.app.use("/api/gameList", this.gameListController.router);
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
