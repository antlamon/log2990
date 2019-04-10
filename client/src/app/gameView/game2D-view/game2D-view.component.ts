import { ChangeDetectorRef, Component, HostListener, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IndexService } from "src/app/services/index.service";
import { TimerService } from "src/app/services/timer.service";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage, Point,
    NewGameStarted, Gamer } from "../../../../../common/communication/message";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IFullGame } from "../../../../../common/models/game";
import { GameService } from "../../services/game.service";
import { SocketService } from "../../services/socket.service";
import { ErrorPopupComponent } from "../error-popup/error-popup.component";
import {GAMES_LIST_PATH, INITIAL_PATH, VICTORY_SOUND_PATH, ERROR_SOUND_PATH, CORRECT_SOUND_PATH} from "../../../app/global/constants";

@Component({
    selector: "app-game2d-view",
    templateUrl: "./game2D-view.component.html",
    styleUrls: ["./game2D-view.component.css"]
})
export class Game2DViewComponent implements OnInit, OnDestroy {

    private simpleGame: IFullGame;
    private gameRoomId: string;
    private gamers: Gamer[];
    private _disableClick: string;
    private _blockedCursor: string;
    private readonly NB_MAX_DIFF: number = 7;
    private readonly NB_MAX_DIFF_MULTI: number = 4;

    private readonly CLICK_DELAY: number = 1000;
    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;

    @ViewChild(ErrorPopupComponent)
    private errorPopup: ErrorPopupComponent;
    private lastClick: MouseEvent;

    public constructor(
        private gameService: GameService,
        private socket: SocketService,
        private route: ActivatedRoute,
        private index: IndexService,
        private timer: TimerService,
        private ref: ChangeDetectorRef,
        private router: Router
    ) {
        if (!this.index.username) {
            this.router.navigate([INITIAL_PATH]);
        }
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
        this.gamers = [];
        this._disableClick = "";
        this._blockedCursor = "";
        this.correctSound = new Audio(CORRECT_SOUND_PATH);
        this.errorSound = new Audio(ERROR_SOUND_PATH);
        this.victorySound = new Audio(VICTORY_SOUND_PATH);
    }

    public ngOnInit(): void {
        this.timer.setToZero();
        this.gameRoomId = this.getGameRoomId();
        this.getSimpleGame();
    }

    @HostListener("window:beforeunload")
    public ngOnDestroy(): void {
        this.socket.unsubscribeTo(SocketsEvents.CREATE_GAME_ROOM);
        this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE);
        if (this.simpleGame) {
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_ROOM, this.gameRoomId);
        }
    }

    private getGameRoomId(): string {
        return this.route.snapshot.queryParamMap.get("gameRoomId");
    }
    private getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    private getSimpleGame(): void {
        this.gameService.getSimpleGame(this.getId())
        .subscribe((response: IFullGame) => {
            this.ref.detach();
            this.simpleGame = response;
            const newGameMessage: NewGameMessage = {
                    username: this.index.username,
                    gameId: this.simpleGame.card.id,
                    gameName: this.simpleGame.card.name,
                    is3D: false,
                    gameRoomId: this.gameRoomId,
                    originalImage: this.simpleGame.card.originalImage,
                    modifiedImage: this.simpleGame.modifiedImage,
                    differenceImage: this.simpleGame.differenceImage
                };
            this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);
            });
    }

    private handleCreateGameRoom(response: NewGameStarted): void {
        this.gameRoomId = response.gameRoomId;
        this.gamers = response.players;
        this.ref.reattach();
        this.timer.startTimer();
    }

    private handleCheckDifference(update: GameRoomUpdate): void {
        if (update.differencesFound === -1) {
            this.handleDifferenceError(update.username);
        } else {
            this.simpleGame.modifiedImage = update.newImage;
            const gamer: Gamer = this.gamers.find((x: Gamer) => x.username === update.username);
            gamer.differencesFound = update.differencesFound;
            const isGameOver: boolean = gamer.differencesFound === (this.gamers.length > 1 ? this.NB_MAX_DIFF_MULTI : this.NB_MAX_DIFF);
            if (update.username === this.index.username) {
                if (isGameOver) {
                    this.finishGame();
                } else {
                    this.correctSound.play().catch((error: Error) => console.error(error.message));
                }
            } else {
                if (isGameOver) {
                    this.timer.stopTimer();
                    this._disableClick = "disable-click";
                    // TODO TELL THE GAMER THAT HE'S BAD
                }
            }
        }
    }

    private handleDifferenceError(username: string): void {
        if (this.index.username === username) {
            this.errorSound.play().catch((error: Error) => console.error(error.message));
            this.errorPopup.showPopup(this.lastClick.clientX, this.lastClick.clientY);
            this._disableClick = "disable-click";
            this._blockedCursor = "cursor-not-allowed";
            setTimeout(
                () => {
                    this.errorPopup.hidePopup();
                    this._disableClick = "";
                    this._blockedCursor = "";
                },
                this.CLICK_DELAY
            );
        }
    }

    private finishGame(): void {
        this.timer.stopTimer();
        this._disableClick = "disable-click";
        this.victorySound.play().catch((error: Error) => console.error(error.message));
        this.socket.emitEvent(SocketsEvents.END_GAME, {
            username: this.index.username,
            score: this.timer.getTimeAsString(),
            gameId: this.simpleGame.card.id,
            gameType: "simple",
            gameRoomId: this.gameRoomId,
        });
        this.getBack();
    }
    private getBack(): void {
        this.router.navigate([GAMES_LIST_PATH]).catch((error: Error) => console.error(error.message));
    }

    public sendClick(event: MouseEvent): void {
        const IMAGE_HEIGHT: number = 480;
        const point: Point = {
            x: event.offsetX,
            y: IMAGE_HEIGHT - event.offsetY,
        };
        const imageClickMessage: ImageClickMessage = {
            point: point,
            gameRoomId: this.gameRoomId,
            username: this.index.username,
        };

        this.lastClick = event;
        this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE, imageClickMessage);
    }
    public get disableClick(): string {
        return this._disableClick;
    }
    public get blockedCursor(): string {
        return this._blockedCursor;
    }
}
