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
        SocketIdentificationManager: Symbol("SocketIdentificationManager"),
};

export  { TYPES };
