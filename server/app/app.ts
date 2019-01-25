import * as express from "express";
import * as logger from "morgan";
import * as cookieParser from "cookie-parser";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import Types from "./types";
import { injectable, inject } from "inversify";
import { IndexController } from "./controllers/index.controller";
import { DateController } from "./controllers/date.controller";
<<<<<<< HEAD
import { ImageController } from "./controllers/image.controlleur";
=======
import { ImageController } from "./controllers/image.controller";
>>>>>>> cc53f2cae2c9eec48dd02893f3aafa46d71484d7

@injectable()
export class Application {

    private readonly internalError: number = 500;
    public app: express.Application;

    public constructor(@inject(Types.IndexController) private indexController: IndexController,
        @inject(Types.DateController) private dateController: DateController,
        @inject(Types.ImageController) private imageController: ImageController) {
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
        this.app.use('/api/index', this.indexController.router);
        this.app.use('/api/date', this.dateController.router);
<<<<<<< HEAD
        this.app.use(this.imageController.url, this.imageController.router);
=======
        this.app.use('/api/imagegen', this.imageController.router)
>>>>>>> cc53f2cae2c9eec48dd02893f3aafa46d71484d7
        this.errorHandeling();
    }

    private errorHandeling(): void {
        // Gestion des erreurs
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
                    error: err
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
                error: {}
            });
        });
    }
}
