import { Injectable } from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { SocketService } from "./socket.service";
import { GameService } from "./game.service";
import { RenderService } from "../scene3D/render.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { SIMPLE_GAME_TYPE, IScoreUpdate, FREE_GAME_TYPE } from "../../../../common/communication/message";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class GameManagerService {
  private _simpleGames: IGame[];
  private _freeGames: IGame3D[];
  private _imageURLs: Map<IGame3D, string>;
  private simpleSubject: BehaviorSubject<IGame[]> = new BehaviorSubject([]);
  private freeSubject: BehaviorSubject<IGame3D[]> = new BehaviorSubject([]);

  public constructor(
    private gameService: GameService,
    private socket: SocketService,
    private renderer: RenderService) {
      this.socket.addEvent(SocketsEvents.UPDATE_SIMPLES_GAMES, this.getSimpleGames.bind(this));
      this.socket.addEvent(SocketsEvents.UPDATE_FREE_GAMES, this.getFreeGames.bind(this));
      this.socket.addEvent(SocketsEvents.SIMPLE_GAME_ADDED, this.addSimpleGame.bind(this));
      this.socket.addEvent(SocketsEvents.FREE_GAME_ADDED, this.addFreeGame.bind(this));
      this.socket.addEvent(SocketsEvents.SIMPLE_GAME_DELETED, this.removeSimpleGame.bind(this));
      this.socket.addEvent(SocketsEvents.FREE_GAME_DELETED, this.removeFreeGame.bind(this));
      this.socket.addEvent(SocketsEvents.SCORES_UPDATED, this.updateScore.bind(this));
      this._imageURLs = new Map();
      this.getSimpleGames();
      this.getFreeGames();
  }
  public get simpleGames(): BehaviorSubject<IGame[]> {
      return this.simpleSubject;
  }
  public get freeGames(): BehaviorSubject<IGame3D[]> {
      return this.freeSubject;
  }
  public getImageUrl(game: IGame3D): string {
    return this._imageURLs.get(game);
  }
  public async updateScore(upd: IScoreUpdate): Promise<void> {
    if (upd.gameType === SIMPLE_GAME_TYPE) {
      if (!this._simpleGames) {
        await this.getSimpleGames();
      }
      const index: number = this._simpleGames.findIndex((x: IGame) => x.id === upd.id);
      if (index !== -1) {
        this._simpleGames[index].solo = upd.solo;
        this._simpleGames[index].multi = upd.multi;
      }
      this.simpleSubject.next(this._simpleGames);
    }
    if (upd.gameType === FREE_GAME_TYPE) {
      if (!this._freeGames) {
        await this.getFreeGames();
      }
      const index: number = this._freeGames.findIndex((x: IGame3D) => x.id === upd.id);
      if (index !== -1) {
        this._freeGames[index].solo = upd.solo;
        this._freeGames[index].multi = upd.multi;
      }
      this.freeSubject.next(this._freeGames);
    }
  }

  public async getSimpleGames(): Promise<void> {
    this._simpleGames = await this.gameService.getSimpleGames().toPromise();
    this.simpleSubject.next(this._simpleGames);
  }
  public addSimpleGame(game: IGame): void {
    this._simpleGames.push(game);
    this.simpleSubject.next(this._simpleGames);
  }
  public addFreeGame(game: IGame3D): void {
    this._freeGames.push(game);
    this.setImageURL(game).catch((error) => console.error(error));
    this.freeSubject.next(this._freeGames);
  }
  public removeSimpleGame(id: string): void {
    const index: number = this._simpleGames.findIndex((x: IGame) => x.id === id);
    if (index !== -1) {
      this._simpleGames.splice(index, 1);
      this.simpleSubject.next(this._simpleGames);
    }
  }
  public removeFreeGame(id: string): void {
    const index: number = this._freeGames.findIndex((x: IGame3D) => x.id === id);
    if (index !== -1) {
      this._freeGames.splice(index, 1);
      this.freeSubject.next(this._freeGames);
    }
  }
  public async getFreeGames(): Promise<void> {
    this._freeGames = await this.gameService.getFreeGames().toPromise();
    for (const game of this._freeGames) {
      this.setImageURL(game).catch((error) => console.error(error));
    }
    this.freeSubject.next(this._freeGames);
  }
  private async setImageURL(game: IGame3D): Promise<void> {
    const imageURL: string = await this.renderer.getImageURL(game);
    this._imageURLs.set(game, imageURL);
  }
}
