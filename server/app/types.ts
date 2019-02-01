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
        GameListService: Symbol.for("GameListService"),
        GameListController: Symbol.for("GameListController"),
};

export  { TYPES };
