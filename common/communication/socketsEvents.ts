export class SocketsEvents {
    public static readonly UPDATE_SIMPLES_GAMES = "update-singles-games";
    public static readonly SOCKET_CONNECTION = "connect";
    public static readonly SOCKET_DISCONNECTION = "disconnect";
    public static readonly UPDATE_FREE_GAMES = "update-free-games";
    public static readonly CHECK_DIFFERENCE = "check-difference";
    public static readonly CHECK_DIFFERENCE_3D = "check-difference-3D";
    public static readonly CREATE_GAME_ROOM = "create-game-room";
    public static readonly DELETE_GAME_ROOM = "delete-game-room";
    public static readonly USER_CONNECTION = "user-connection";
    public static readonly NEW_BEST_TIME = "user-best-score";
    public static readonly DELETE_GAME_3D_ROOM = "delete-game-3D-room";
    public static readonly SIMPLE_GAME_ADDED = "add-simple";
    public static readonly FREE_GAME_ADDED = "add-free";
    public static readonly SIMPLE_GAME_DELETED = "delete-simple";
    public static readonly FREE_GAME_DELETED = "delete-free";
    public static readonly SCORES_UPDATED = "scores-update";
    public static readonly END_GAME = "end-game";
    public static readonly NEW_GAME_MESSAGE = "new-game";
    public static readonly NEW_MULTIPLAYER_GAME = "new-multi-game";
    public static readonly CANCEL_MULTIPLAYER_GAME = "cancel-multi-game";
    public static readonly START_MULTIPLAYER_GAME = "start-multi-game";
    public static readonly NEW_GAME_LIST_LOADED = "new-game-list-loaded";
}
