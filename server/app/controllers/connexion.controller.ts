import Types from "../types";
import { injectable, inject } from "inversify";
import { Router, Request, Response, NextFunction } from "express";
import {ConnexionService} from "../services/connexion.service";

@injectable()
export class ConnexionController {

    public constructor(@inject(Types.ConnexionService) private connexionService: ConnexionService) { }

    public get router(): Router {
        const router: Router = Router();
        router.get("/",
            (req: Request, res: Response, next: NextFunction) => {
                this.connexionService.addName(req.query.name,req.query.id).then(message => {
                    res.json(message);
                });
            });
        router.get("/disconnect",
            (req: Request, res: Response, next: NextFunction) => {
                this.connexionService.removeName(req.query.name).then(message => {
                    res.json(message);
                });
            });
        return router;
    }
}
