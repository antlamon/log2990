import { inject } from "inversify";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";

export class GameRoomService {
    public constructor(@inject(TYPES.SocketServerManager) private socketManager: SocketServerManager) { }
}

interface GameRoom {
    users: Gamer[];
    gameRoomId: string;
}

interface Gamer {
    username: string;
    differencesFound: number;
}
