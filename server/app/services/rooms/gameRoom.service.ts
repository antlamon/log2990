import Axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import { BASE_ID, Game3DRoomUpdate, GameRoomUpdate, INewGameMessage, Point } from "../../../../common/communication/message";

@injectable()
export class GameRoomService {

    private gameRooms: GameRooms;
    private readonly IDENTIFICATION_URL: string = "http://localhost:3000/api/identification";
    private readonly IDENTIFICATION_3D_URL: string = "http://localhost:3000/api/identification3D";

    public constructor() {
        this.gameRooms = {} as GameRooms;
    }

    public async createNewGameRoom(newGameMessage: INewGameMessage): Promise<string> {
        const response: AxiosResponse = await Axios.post(newGameMessage.is3D ?
            this.IDENTIFICATION_3D_URL : this.IDENTIFICATION_URL,
                                                         newGameMessage);
        if (response.data.title !== BASE_ID) {

            return Promise.reject(Error(response.data.body));
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
    public async checkDifference3D(gameRoomId: string, username: string, objName: string): Promise<Game3DRoomUpdate> {
        const response: AxiosResponse = await Axios.get(this.IDENTIFICATION_3D_URL,
                                                        { params: { gameRoomId: gameRoomId, objName: objName } });
        if (response.data.title !== BASE_ID) {
            return {
                username: username,
                differencesFound: -1,
                objName: "none",
                diffType: "none",
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
            differencesFound: ++gamer.differencesFound,
            objName: response.data.body.name,
            diffType: response.data.body.type,
        };
    }

    public async deleteGameRoom(gameRoomId: string): Promise<void> {
        await Axios.delete(this.IDENTIFICATION_URL, { params: { gameRoomId: gameRoomId } });
    }
    public async deleteGame3DRoom(gameRoomId: string): Promise<void> {
        await Axios.delete(this.IDENTIFICATION_3D_URL, { params: { gameRoomId: gameRoomId } });
    }
}

interface GameRooms {
    [index: string]: Gamer[];
}

interface Gamer {
    username: string;
    differencesFound: number;
}
