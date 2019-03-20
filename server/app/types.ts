// tslint:disable-next-line:typedef
const TYPES =  {
        Server: Symbol("Server"),
        Application: Symbol("Application"),
        ImageController: Symbol("ImageController"),
        ImageService: Symbol("ImageService"),
        ConvertImage: Symbol("ConvertImage"),
        ConnexionController : Symbol("ConnexionController"),
        ConnexionService: Symbol("ConnexionService"),
        GameListService: Symbol.for("GameListService"),
        GameListController: Symbol.for("GameListController"),
        UserManager: Symbol("UserManager"),
        SocketServerManager: Symbol("SocketServerManager"),
        DatabaseClient: Symbol("DatabaseClient"),
        Game3DGeneratorService: Symbol("Game3DGeneratorService"),
        Game3DModificatorService: Symbol("Game3DModificatorService"),
        ObjectGeneratorService: Symbol("ObjectGeneratorService"),
        IdentificationController: Symbol("IdentificationController"),
        IdentificationServiceManager: Symbol("IdentificationServiceManager"),
        GameRoomService: Symbol("GameRoomService"),
        FormValidatorService: Symbol("FormValidatorService"),
        TimeScoreService: Symbol("TypescoreService"),
        TimeScoreController: Symbol("TimescoreController"),
};

export  { TYPES };
