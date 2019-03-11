import { TestBed } from "@angular/core/testing";

import {TimerService } from "./timer.service";

const testDelay: number = 2000;
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
      },         testDelay );
    });
    it("The function passed in parameters of start function should not be called if stopTimer was called", (done) => {
      const service: TimerService = TestBed.get(TimerService);
      let boolHasBeenCalled: boolean = false;
      const testFunction: () => void = () => boolHasBeenCalled = true;
      service.startTimer({minutes: 0, seconds: 2}, testFunction.bind(boolHasBeenCalled));
      service.stopTimer();
      setTimeout(() => {
        expect(boolHasBeenCalled).toEqual(false);
        done();
      },         testDelay );
    });
    it("Time should be updated correctly", (done) => {
      const service: TimerService = TestBed.get(TimerService);
      service.startTimer({minutes: 0, seconds: 2}, () => {});
      setTimeout(() => {
        expect(service.getTime()).toEqual({minutes: 0, seconds: 2});
        done();
      },         testDelay );
    });
  });
});
