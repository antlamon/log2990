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
        Identification3DController: Symbol("Identification3DController"),
        IdentificationServiceManager: Symbol("IdentificationServiceManager"),
        Identification3DServiceManager: Symbol("Identification3DServiceManager"),
        GameRoomService: Symbol("GameRoomService"),
        FormValidatorService: Symbol("FormValidatorService"),
        GameMessageService: Symbol.for("GameMessageService"),
        TimeScoreService: Symbol("TypescoreService"),
        TimeScoreController: Symbol("TimescoreController"),
};

export  { TYPES };
