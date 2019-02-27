import { injectable } from "inversify";
import {Db, MongoClient, MongoError} from "mongodb";

@injectable()
export class DatabaseService {
    private static readonly DB_PASSWORD: string = "admin205";
    private static readonly DB_DB: string = "poly2019equipe205";
    private static readonly DB_HOST: string = "ds227255.mlab.com";
    private static readonly DB_PORT: string = "27255";
    private static readonly DB_USER: string = "admin";
    private static readonly DB_URL: string = "mongodb://" + DatabaseService.DB_USER + ":" + DatabaseService.DB_PASSWORD +
                                             "@" + DatabaseService.DB_HOST + ":" + DatabaseService.DB_PORT + "/" + DatabaseService.DB_DB;
    public db: Db;
    public constructor() {
            MongoClient.connect(DatabaseService.DB_URL, {useNewUrlParser : true}, (err: MongoError, client: MongoClient) => {
                if (!err) {
                    this.db = client.db(DatabaseService.DB_DB);
                }
            });
    }
}
