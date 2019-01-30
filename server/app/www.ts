import { ServerInterface } from "./interfaces";
import { TYPES } from "./types";
import "reflect-metadata";
import { container } from "./inversify.config";

const server: ServerInterface = container.get<ServerInterface>(TYPES.ServerInterface);

server.init();
