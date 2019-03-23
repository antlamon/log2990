import Axios, { AxiosResponse } from "axios";
import { injectable } from "inversify";
import "reflect-metadata";
import { Message, BASE_ID } from "../../../common/communication/message";
import { IMessageForm, IGameMessage } from "../../../common/models/simpleGameMessage";


@injectable()
export class GameMessageService {

    private gameMessages: IGameMessage[];
    private readonly MESSAGE_URL: string = "http://localhost:3000/api/messages";

    public constructor() {
        this.gameMessages = {} as IGameMessage[];
    }

    public async sendMessage(newMsg: IMessageForm): Promise<Message> {

        const today: Date = new Date();
        const msgTime: string = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        const form: FormData = new FormData();
        form.append("eventType", newMsg.eventType);
        form.append("username", newMsg.username);

        const response: AxiosResponse<Message> = await Axios.post(this.MESSAGE_URL, form);
        if (response.data.title !== BASE_ID) {
            return Promise.reject(Error(response.data.body));
        }
        const newMessage: IGameMessage = {
          username: newMsg.username,
          eventType: newMsg.eventType,
          time: msgTime,
        };

        this.gameMessages.push(newMessage);

        return response.data;

    }

}
