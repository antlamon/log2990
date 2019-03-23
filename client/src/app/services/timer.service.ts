import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimerService {

  public readonly CONVERSION_SEC_TO_MILI: number = 1000;
  public readonly CONVERSION_MIN_TO_SEC: number = 60;
  public readonly FORMAT_ZERO_MAX: number = 9;
  private nbSeconds: number;
  private nbMinutes: number;
  private timerEnd: NodeJS.Timeout;
  private timerUpdate: NodeJS.Timeout;
  public constructor() {
    this.nbSeconds = 0;
    this.nbMinutes = 0;
   }

  public startTimer(): void {
    this.nbSeconds = 0;
    this.nbMinutes = 0;
    this.timerUpdate = setInterval(this.updateTime.bind(this), this.CONVERSION_SEC_TO_MILI);

  }
  public stopTimer(): void {
    clearTimeout(this.timerEnd);
    clearInterval(this.timerUpdate);
  }
  public getTimeAsString(): string {
    let time: string = "";
    if (this.nbMinutes <= this.FORMAT_ZERO_MAX) {
      time += "0";
    }
    time += this.nbMinutes + ":";
    if (this.nbSeconds <= this.FORMAT_ZERO_MAX) {
      time += "0";
    }
    time += this.nbSeconds;

    return time;
  }
  private updateTime(): void {
    this.nbSeconds++;
    if (this.nbSeconds === this.CONVERSION_MIN_TO_SEC) {
      this.nbMinutes++;
      this.nbSeconds = 0;
    }
  }
}
export interface ITime {
  minutes: number;
  seconds: number;
}
