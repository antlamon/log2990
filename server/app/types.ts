const TYPES =  {
        Server: Symbol("Server"),
        Application: Symbol("Application"),
        IndexController: Symbol("IndexController"),
        DateController: Symbol("DateController"),
        IndexService: Symbol("IndexService"),
        DateService: Symbol("DateService"),
        ImageController: Symbol("ImageController"),
        ImageService: Symbol("ImageService"),
        ConvertImage: Symbol("ConvertImage"),
        ConnexionController : Symbol("ConnexionController"),
        ConnexionService: Symbol("ConnexionService"),
        ServerInterface: Symbol.for("ServerInterface"),
        ApplicationInterface: Symbol.for("ApplicationInterface"),
        DateControllerInterface: Symbol.for("DateControllerInterface"),
        IndexControllerInterface: Symbol.for("IndexControllerInterface"),
        IndexServiceInterface: Symbol.for("IndexServiceInterface"),
        DateServiceInterface: Symbol.for("DateServiceInterface"),
        ImageControllerInterface: Symbol.for("ImageControllerInterface"),
        ImageServiceInterface: Symbol.for("ImageServiceInterface"),
        ConvertImageServiceInterface: Symbol.for("ConvertImageServiceInterface")
};

export  { TYPES };
