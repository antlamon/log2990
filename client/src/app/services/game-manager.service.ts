import { Injectable } from "@angular/core";
import { IGame } from "../../../../common/models/game";
import { IGame3D } from "../../../../common/models/game3D";
import { SocketService } from "./socket.service";
import { GameService } from "./game.service";
import { RenderService } from "../scene3D/render.service";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";
import { SIMPLE_GAME_TYPE, IScoreUpdate, FREE_GAME_TYPE } from "../../../../common/communication/message";

@Injectable({
  providedIn: "root"
})
export class GameManagerService {
  private _simpleGames: IGame[];
  private _freeGames: IGame3D[];
  private _imageURLs: Map<IGame3D, string>;

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
  }
  public get simpleGames(): IGame[] {
      return this._simpleGames;
  }
  public get freeGames(): IGame3D[] {
      return this._freeGames;
  }
  public getImageUrl(game: IGame3D): string {
    return this._imageURLs.get(game);
  }
  public async updateScore(upd: IScoreUpdate): Promise<void> {
    if (upd.gameType === SIMPLE_GAME_TYPE) {
      if (!this.simpleGames) {
        await this.getSimpleGames();
      }
      const index: number = this.simpleGames.findIndex((x: IGame) => x.id === upd.id);
      if (index !== -1) {
        this.simpleGames[index].solo = upd.solo;
        this.simpleGames[index].multi = upd.multi;
      }
    }
    if (upd.gameType === FREE_GAME_TYPE) {
      if (!this.freeGames) {
        await this.getFreeGames();
      }
      const index: number = this.freeGames.findIndex((x: IGame3D) => x.id === upd.id);
      if (index !== -1) {
        this.freeGames[index].solo = upd.solo;
        this.freeGames[index].multi = upd.multi;
      }
    }
  }

  public async getSimpleGames(): Promise<void> {
    this._simpleGames = await this.gameService.getSimpleGames().toPromise();
  }
  public addSimpleGame(game: IGame): void {
    this._simpleGames.push(game);
  }
  public addFreeGame(game: IGame3D): void {
    this._freeGames.push(game);
    this.setImageURL(game).catch((error) => console.error(error));
    // this.getFreeGames().catch((error) => console.error(error));
  }
  public removeSimpleGame(id: string): void {
    const index: number = this.simpleGames.findIndex((x: IGame) => x.id === id);
    if (index !== -1) {
      this.simpleGames.splice(index, 1);
    }
  }
  public removeFreeGame(id: string): void {
    const index: number = this.freeGames.findIndex((x: IGame3D) => x.id === id);
    if (index !== -1) {
      this.freeGames.splice(index, 1);
    }
  }
  public async getFreeGames(): Promise<void> {
    this._freeGames = await this.gameService.getFreeGames().toPromise();
    for (const game of this.freeGames) {
      this.setImageURL(game).catch((error) => console.error(error));
    }
  }
  private async setImageURL(game: IGame3D): Promise<void> {
    const imageURL: string = await this.renderer.getImageURL(game);
    this._imageURLs.set(game, imageURL);
  }
}
