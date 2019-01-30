import Axios from 'axios';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Message } from '../../../common/communication/message';
import { IndexServiceInterface } from '../interfaces';

@injectable()
export class IndexService implements IndexServiceInterface {
    public about(): Message {
        return {
            title: 'This is merely a test',
            body: 'Lorem ipsum........',
        };
    }

    public async helloWorld(): Promise<Message> {
        return Axios.get<Message>('http://localhost:3000/api/date')
            .then((timeMessage) => {
                        return {
                            title: 'Hello world',
                            body: 'Time is ' + timeMessage.data.body}; })
            .catch((error) => {
                        console.error('There was an error!!!', error);

                        return {
                            title: 'Error',
                            body: error.toString()}; });
    }
}
