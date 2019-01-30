import { expect } from 'chai';
import { Container } from 'inversify';
import { injectable } from 'inversify';
import 'reflect-metadata';
import { Message } from '../../../common/communication/message';
import { DateServiceInterface } from '../interfaces';
import { TYPES } from '../types';

@injectable()
class DateServiceBidon implements DateServiceInterface {

    public currentTime(): Promise<Message> {
        return new Promise<Message>(function(resolve, reject) {
                                        resolve({title: 'Time',
                                                 body: "Aujourd'hui"});
                                    });
    }
}

const container: Container = new Container();
container.bind<DateServiceInterface>(TYPES.DateServiceInterface).to(DateServiceBidon);

const service: DateServiceInterface =
     container.get<DateServiceInterface>(TYPES.DateServiceInterface);

describe('function currentTime', () => {
    it('should return correct date', async () => {
        const result: Message = await service.currentTime();
        expect(result.body).to.equal("Aujourd'hui");
    });

});
