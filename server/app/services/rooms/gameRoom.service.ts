import Axios, { AxiosResponse } from "axios";
import { Guid } from "guid-typescript";
import { injectable } from "inversify";
import { BASE_ID, EndGameMessage, Game3DRoomUpdate, Gamer, GameRoomUpdate, INewGameMessage,
     NewGameStarted, NewMultiplayerGame, NewScoreUpdate, Point } from "../../../../common/communication/message";

@injectable()
export class GameRoomService {

    private gameRooms: GameRooms;
    private readonly IDENTIFICATION_URL: string = "http://localhost:3000/api/identification";
    private readonly IDENTIFICATION_3D_URL: string = "http://localhost:3000/api/identification3D";
    private readonly TIMESCORE_URL: string = "http://localhost:3000/api/timescore";
    private readonly MAX_SOLO_DIFFERENCES: number = 7;
    private readonly MAX_MULTI_DIFFERENCES: number = 4;

    public constructor() {
        this.gameRooms = {} as GameRooms;
    }

    public async startGameRoom(newGameMessage: INewGameMessage): Promise<NewGameStarted> {
        if (newGameMessage.gameRoomId == null) {
            const gameRoomId: string = Guid.create().toString();
            newGameMessage.gameRoomId = gameRoomId;
            this.createGameRoom(newGameMessage.gameRoomId, newGameMessage.gameId, newGameMessage.gameName);
            this.joinGameRoom(newGameMessage.username, newGameMessage.gameRoomId);
        }
        if (!this.gameRooms[newGameMessage.gameRoomId].serviceStarted) {
            const response: AxiosResponse = await Axios.post(newGameMessage.is3D ?
                this.IDENTIFICATION_3D_URL : this.IDENTIFICATION_URL,
                                                             newGameMessage);
            if (response.data.title !== BASE_ID) {
                return Promise.reject(Error(response.data.body));
            }
            this.gameRooms[newGameMessage.gameRoomId].serviceStarted = true;
        }
        const gamer: Gamer | undefined = this.gameRooms[newGameMessage.gameRoomId].gamer
        .find((user: Gamer) => user.username === newGameMessage.username);
        if (gamer !== undefined) {
            gamer.isReady = true;
        }

        return {
            gameRoomId: newGameMessage.gameRoomId,
            players: this.gameRooms[newGameMessage.gameRoomId].gamer,
            startTime: new Date(),
        };
    }

    public createWaitingGameRoom(newGameMessage: INewGameMessage): NewMultiplayerGame {
        const gameRoomId: string = Guid.create().toString();
        this.createGameRoom(gameRoomId, newGameMessage.gameId, newGameMessage.gameName);
        this.joinGameRoom(newGameMessage.username, gameRoomId);

        return {
            gameId: newGameMessage.gameId,
            gameRoomId,
        };
    }

    public findWaitingGameRooms(): NewMultiplayerGame[] {

        const waitingRooms: NewMultiplayerGame[] = [];

        for (const index in this.gameRooms) {
            if (!this.gameRooms[index].serviceStarted) {
                waitingRooms.push({
                    gameId: this.gameRooms[index].game.gameId,
                    gameRoomId: index,
                });
            }
        }

        return waitingRooms;
    }

    public joinGameRoom(username: string, gameRoomId: string): void {
        const newGamer: Gamer = {
            username,
            differencesFound: 0,
            isReady: false,
        };
        this.gameRooms[gameRoomId].gamer.push(newGamer);
    }

    private createGameRoom(gameRoomId: string, gameId: string, gameName: string): void {
        this.gameRooms[gameRoomId] = {
            game: {
                gameId,
                gameName,
            },
            gamer: [],
            serviceStarted: false,
        };
    }

    public async checkDifference(gameRoomId: string, username: string, point: Point): Promise<GameRoomUpdate> {
        const response: AxiosResponse = await Axios.get(this.IDENTIFICATION_URL,
                                                        { params: { gameRoomId: gameRoomId, point: point } });
        if (response.data.title !== BASE_ID) {
            return {
                username: username,
                newImage: response.data.body,
                differencesFound: -1,
                isGameOver: false,
            };
        }
        const gamer: Gamer | undefined = this.gameRooms[gameRoomId].gamer.find((user: Gamer) => user.username === username);
        if (gamer === undefined) {
            throw new Error("Unasigned Gamer");
        }

        return {
            username: username,
            newImage: response.data.body,
            differencesFound: ++gamer.differencesFound,
            isGameOver: this.gameRooms[gameRoomId].gamer.length === 1 ? gamer.differencesFound === this.MAX_SOLO_DIFFERENCES
                : gamer.differencesFound === this.MAX_MULTI_DIFFERENCES,
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
                isGameOver: false,
            };
        }
        const gamer: Gamer | undefined = this.gameRooms[gameRoomId].gamer.find((user: Gamer) => user.username === username);
        if (gamer === undefined) {
            throw new Error("Unasigned Gamer");
        }

        return {
            username: username,
            differencesFound: ++gamer.differencesFound,
            objName: response.data.body.name,
            diffType: response.data.body.type,
            isGameOver: this.gameRooms[gameRoomId].gamer.length === 1 ? gamer.differencesFound === this.MAX_SOLO_DIFFERENCES
                : gamer.differencesFound === this.MAX_MULTI_DIFFERENCES,
        };
    }

    public cancelWaitingRoom(gameId: string): void {
        for (const index in this.gameRooms) {
            if (this.gameRooms[index].game.gameId === gameId && !this.gameRooms[index].serviceStarted) {
                    delete this.gameRooms[index];
                    break;
            }
        }
    }

    public async deleteGameRoom(gameRoomId: string): Promise<void> {
        if (this.gameRooms[gameRoomId]) {
            await Axios.delete(this.IDENTIFICATION_URL, { params: { gameRoomId: gameRoomId } });
            delete this.gameRooms[gameRoomId];
        }
    }

    public async deleteGame3DRoom(gameRoomId: string): Promise<void> {
        if (this.gameRooms[gameRoomId]) {
            await Axios.delete(this.IDENTIFICATION_3D_URL, { params: { gameRoomId: gameRoomId } });
            delete this.gameRooms[gameRoomId];
        }
    }

    public async endGame(endGameMessage: EndGameMessage): Promise<NewScoreUpdate> {
        const gameMode: string = this.gameRooms[endGameMessage.gameRoomId].gamer.length === 1 ? "solo" : "multi";
        const scoreTime: string[] = endGameMessage.score.split(":");
        const gameName: string = this.gameRooms[endGameMessage.gameRoomId].game.gameName;
        const scoreUpdate: AxiosResponse = await Axios.put(this.TIMESCORE_URL, {
            username: endGameMessage.username, gameType: endGameMessage.gameType, gameMode: gameMode,
            id: endGameMessage.gameId, nbMinutes: scoreTime[0], nbSeconds: scoreTime[1],
        });

        return {
            scoreUpdate: scoreUpdate.data.body,
            username: endGameMessage.username,
            gameMode,
            gameName,
        };
    }
}

interface GameRooms {
    [index: string]: {
        game: Game,
        gamer: Gamer[],
        serviceStarted: boolean,
    };
}

interface Game {
    gameId: string;
    gameName: string;
}
