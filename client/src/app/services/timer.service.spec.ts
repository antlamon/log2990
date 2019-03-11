/*import { TestBed } from "@angular/core/testing";

import {TimerService } from "./timer.service";

describe("TimerService", () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it("should be created", () => {
    const service: TimerService = TestBed.get(TimerService);
    expect(service).toBeTruthy();
  });

  describe("General test for all function", async () => {
    it("The function passed in parameters of start function should be called after the time has elapsed", (done) => {
      const service: TimerService = TestBed.get(TimerService);
      let boolHasBeenCalled: boolean = false;
      const testFunction: () => void = () => boolHasBeenCalled = true;
      service.startTimer({minutes: 0, seconds: 2}, testFunction.bind(boolHasBeenCalled));
      setTimeout(() => {
        expect(boolHasBeenCalled).toEqual(true);
        done();
      }, 2002 );
    });
  });
});*/
