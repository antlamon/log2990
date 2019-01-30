import 'reflect-metadata';
import { ServerInterface } from './interfaces';
import { container } from './inversify.config';
import { TYPES } from './types';

const server: ServerInterface = container.get<ServerInterface>(TYPES.ServerInterface);

server.init();
