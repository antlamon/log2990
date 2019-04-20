export class SocketsEvents {
    public static readonly UPDATE_SIMPLES_GAMES: string = "update-singles-games";
    public static readonly SOCKET_CONNECTION: string = "connect";
    public static readonly SOCKET_DISCONNECTION: string = "disconnect";
    public static readonly UPDATE_FREE_GAMES: string = "update-free-games";
    public static readonly CHECK_DIFFERENCE: string = "check-difference";
    public static readonly CHECK_DIFFERENCE_3D: string = "check-difference-3D";
    public static readonly CREATE_GAME_ROOM: string = "create-game-room";
    public static readonly DELETE_GAME_ROOM: string = "delete-game-room";
    public static readonly USER_CONNECTION: string = "user-connection";
    public static readonly DELETE_GAME_3D_ROOM: string = "delete-game-3D-room";
    public static readonly SIMPLE_GAME_ADDED: string = "add-simple";
    public static readonly FREE_GAME_ADDED: string = "add-free";
    public static readonly SIMPLE_GAME_DELETED: string = "delete-simple";
    public static readonly FREE_GAME_DELETED: string = "delete-free";
    public static readonly SCORES_UPDATED: string = "scores-update";
    public static readonly END_GAME: string = "end-game";
    public static readonly NEW_GAME_MESSAGE: string = "new-game";
    public static readonly NEW_MULTIPLAYER_GAME: string = "new-multi-game";
    public static readonly CANCEL_MULTIPLAYER_GAME: string = "cancel-multi-game";
    public static readonly START_MULTIPLAYER_GAME: string = "start-multi-game";
    public static readonly NEW_GAME_LIST_LOADED: string = "new-game-list-loaded";
    public static readonly USER_CONNECTED_TYPE: string = "userConnected";
    public static readonly USER_DISCONNECTED_TYPE: string = "userDisconnected";
}
