
export interface IGameMessage {
    eventType: string;
    time: string;
    username: string;
    data: string;
}

export interface IMessageForm {
    eventType: string;
    username: string;
}