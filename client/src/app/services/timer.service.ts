import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class TimerService {

  public readonly CONVERSION_SEC_TO_MILI: number = 1000;
  public readonly CONVERSION_MIN_TO_SEC: number = 60;
  public nbSeconds: number;
  public nbMinutes: number;
  private timerEnd: NodeJS.Timeout;
  private timerUpdate: NodeJS.Timeout;
  public constructor() {
    this.nbSeconds = 0;
    this.nbMinutes = 0;
   }

  public startTimer(endTime: ITime, endFunction: () => void): void {
    this.nbSeconds = 0;
    this.nbMinutes = 0;
    this.timerEnd = setTimeout(endFunction, this.CONVERSION_SEC_TO_MILI * (endTime.seconds + this.CONVERSION_MIN_TO_SEC * endTime.minutes));
    setTimeout(this.stopTimer.bind(this), this.CONVERSION_SEC_TO_MILI * (endTime.seconds + this.CONVERSION_MIN_TO_SEC * endTime.minutes));
    this.timerUpdate = setInterval(this.updateTime.bind(this), this.CONVERSION_SEC_TO_MILI);

  }
  public stopTimer(): void {
    clearTimeout(this.timerEnd);
    clearInterval(this.timerUpdate);
  }
  public getTime(): ITime {
    return {minutes: this.nbMinutes, seconds: this.nbSeconds};
  }
  private updateTime(): void {
    this.nbSeconds++;
    if (this.nbSeconds === this.CONVERSION_MIN_TO_SEC) {
      this.nbMinutes++;
      this.nbSeconds = 0;
    }
    this.timerUpdate = setInterval(this.updateTime, this.CONVERSION_SEC_TO_MILI);
  }
}
export interface ITime {
  minutes: number;
  seconds: number;
}
