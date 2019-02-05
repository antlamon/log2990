// tslint:disable:no-unused-variables
import { TestBed, inject } from "@angular/core/testing";

import { SocketService } from "./socket.service";

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

});
