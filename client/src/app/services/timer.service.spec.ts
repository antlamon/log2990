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
    it("Time should be updated correctly", (done) => {
      const service: TimerService = TestBed.get(TimerService);
      service.startTimer();
      setTimeout(() => {
        service.stopTimer();
        expect(service.getTimeAsString()).toEqual("00:02");
        done();
      },         testDelay );
    });
    it("Time should be formatted correctly", () => {
      const service: TimerService = TestBed.get(TimerService);
      service["_nbMinutes"] = service.FORMAT_ZERO_MAX + 1;
      service["_nbSeconds"] = service.FORMAT_ZERO_MAX - 1;
      expect(service.getTimeAsString()).toEqual("10:08");
    });
  });
});
