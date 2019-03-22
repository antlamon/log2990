import Axios, { AxiosResponse } from "axios";
import { inject, injectable } from "inversify";
import { Collection } from "mongodb";
import "reflect-metadata";
import { ERROR_ID, Message } from "../../../common/communication/message";
import { SocketsEvents } from "../../../common/communication/socketsEvents";
import { IMessageForm, IGameMessage } from "../../../common/models/simpleGameMessage";
import { SocketServerManager } from "../socket/socketServerManager";
import { TYPES } from "../types";
import { DatabaseService } from "./database.service";

@injectable()
export class GameMessageService {

    private readonly MESSAGE_COLLECTION: string = "game-messages";
    private _messageCollection: Collection;

    public constructor( @inject(TYPES.SocketServerManager) private socketController: SocketServerManager,
                        @inject(TYPES.DatabaseService) private databaseService: DatabaseService) {

    }

    public async getMessages(): Promise<IGameMessage[]> {

        return this.messageCollection.find({}).toArray();
    }

    private get messageCollection(): Collection {
        if (this._messageCollection == null) {
            this._messageCollection = this.databaseService.db.collection(this.MESSAGE_COLLECTION);
        }

        return this._messageCollection;
    }

    public async sendMessage(newMsg: IMessageForm): Promise<Message> {
        const today: Date = new Date();
        const msgTime: string = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const form: FormData = new FormData();
        form.append("eventType", newMsg.eventType);
        form.append("username", newMsg.username);
        form.append("time", msgTime);

        const response: AxiosResponse<Message> = await Axios.post("http://localhost:3000/api/gameMessage", form);
        const message: Message = response.data;

        if (message.title !== ERROR_ID) {
            this.messageCollection.insertOne(
               {msg: {
                    eventType: newMsg.eventType,
                    username: newMsg.username,
                    time: msgTime,
               },

            }).then(
                () => { this.socketController.emitEvent(SocketsEvents.NEW_GAME_MESSAGE); },
                ).catch();
        }

        return (message);
    }

}
