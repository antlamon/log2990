import { BASE_ID, Message } from "../../../common/communication/message";
import { IGame3D } from "../../../common/models/game3D";

export class Identification3DService {
//     public constructor(private game: IGame3D, private pos: {x: number, y: number, z: number} ) { }

    public getDifference(gameRoomId: string, objName: string, game: IGame3D): Message {

        return {
            title: BASE_ID,
            body: objName,
        };
    }
}
