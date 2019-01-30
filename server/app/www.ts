import "reflect-metadata";
import { Server } from "./server";
import { container } from "./inversify.config";
import { TYPES } from "./types";

const server: Server = container.get<Server>(TYPES.Server);

server.init();
