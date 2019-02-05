// tslint:disable:no-unused-variables
import { TestBed, inject } from "@angular/core/testing";

import { SocketService } from "./socket.service";
//import {SocketIO, Server} from 'mock-socket';

describe("SocketService", () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocketService]
    });
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
  });

  it("should be created", inject([SocketService], (service: SocketService) => {
    expect(service).toBeTruthy();
  }));

  it("function get id should return an id that is not null if socket is connected",async(done: DoneFn) =>{

  });

});
