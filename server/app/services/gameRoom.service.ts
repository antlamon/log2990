import Axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { BASE_ID, GameRoomUpdate, NewGameMessage, Point } from "../../../common/communication/message";

@injectable()
export class GameRoomService {

    private gameRooms: GameRooms;
    private readonly IDENTIFICATION_URL: string = "http://localhost:3000/api/identification";

    public constructor() {
        this.gameRooms = {} as GameRooms;
    }

    public async createNewGameRoom(newGameMessage: NewGameMessage): Promise<string> {
        const response: AxiosResponse = await Axios.post(this.IDENTIFICATION_URL, newGameMessage);
        if (response.data.title !== BASE_ID) {
            return Promise.reject("Couldn't create a new identification service");
        }
        const newGamer: Gamer = {
            username: newGameMessage.username,
            differencesFound: 0,
        };
        this.gameRooms[newGameMessage.gameRoomId] = [];
        this.gameRooms[newGameMessage.gameRoomId].push(newGamer);

        return response.data.body;
    }

    public async checkDifference(gameRoomId: string, username: string, point: Point): Promise<GameRoomUpdate> {
        const response: AxiosResponse = await Axios.get(this.IDENTIFICATION_URL,
                                                        { params: { gameRoomId: gameRoomId, point: point } });
        if (response.data.title !== BASE_ID) {
            return {
                username: username,
                newImage: response.data.body,
                differencesFound: -1,
            };
        }
        let gamer: Gamer | undefined = this.gameRooms[gameRoomId].find((user: Gamer) => user.username === username);
        if (gamer === undefined) {
            gamer = {
                username: username,
                differencesFound: 0,
            };
            this.gameRooms[gameRoomId].push(gamer);
        }

        return {
            username: username,
            newImage: response.data.body,
            differencesFound: ++gamer.differencesFound,
        };
    }
}

interface GameRooms {
    [index: string]: Gamer[];
}

interface Gamer {
    username: string;
    differencesFound: number;
}
