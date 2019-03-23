
export interface IGameMessage{
    eventType: string;
    time: string;
    username: string;
}

export interface IMessageForm{
    eventType: string;
    username: string;
}

export interface BestTimeMessage {
    msg: IGameMessage;
    position: number;
    gameName: string;
    nbPlayers: string;
}

