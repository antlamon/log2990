import { OnInit, OnDestroy, ViewChild, ChangeDetectorRef } from "@angular/core";
import { Gamer, NewGameStarted, GameRoomUpdate } from "../../../../common/communication/message";
import { ErrorPopupComponent } from "./error-popup/error-popup.component";
import { GameService } from "../services/game.service";
import { SocketService } from "../services/socket.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IndexService } from "../services/index.service";
import { TimerService } from "../services/timer.service";
import { INITIAL_PATH, CORRECT_SOUND_PATH, ERROR_SOUND_PATH, VICTORY_SOUND_PATH, GAMES_LIST_PATH } from "../global/constants";
import { SocketsEvents } from "../../../../common/communication/socketsEvents";

export class GameViewComponent implements OnInit, OnDestroy {
    private readonly CLICK_DELAY: number = 1000;
    private readonly NB_MAX_DIFF: number = 7;
    private readonly NB_MAX_DIFF_MULTI: number = 4;

    protected gamers: Gamer[];
    protected disableClick: string;
    protected blockedCursor: string;
    protected gameRoomId: string;

    @ViewChild(ErrorPopupComponent)
    private errorPopup: ErrorPopupComponent;
    private lastClick: MouseEvent;

    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;

    protected constructor(
        private gameService: GameService,
        private socket: SocketService,
        private route: ActivatedRoute,
        private index: IndexService,
        private timer: TimerService,
        private ref: ChangeDetectorRef,
        private router: Router) {
        if (!this.index.username) {
            this.router.navigate([INITIAL_PATH]);
        }
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
        this.correctSound = new Audio(CORRECT_SOUND_PATH);
        this.errorSound = new Audio(ERROR_SOUND_PATH);
        this.victorySound = new Audio(VICTORY_SOUND_PATH);
        this.gamers = [];
        this.disableClick = "";
        this.blockedCursor = "";
    }

    public ngOnInit(): void {
        this.timer.setToZero();
        this.gameRoomId = this.getGameRoomId();
    }

    public ngOnDestroy(): void {
        this.socket.unsubscribeTo(SocketsEvents.CREATE_GAME_ROOM);
        this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE);
    }

    protected getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    private getGameRoomId(): string {
        return this.route.snapshot.queryParamMap.get("gameRoomId");
    }

    private handleCreateGameRoom(response: NewGameStarted): void {
        this.gameRoomId = response.gameRoomId;
        this.gamers = response.players;
        this.ref.reattach();
        this.timer.startTimer();
    }

    protected handleCheckDifference(update: GameRoomUpdate): void {}

    protected handleDifferenceFound(username: string, differencesFound: number): void {
        const gamer: Gamer = this.gamers.find((x: Gamer) => x.username === username);
        gamer.differencesFound = differencesFound;
        const isGameOver: boolean = differencesFound === (this.gamers.length > 1 ? this.NB_MAX_DIFF_MULTI : this.NB_MAX_DIFF);
        if (username === this.index.username) {
            if (isGameOver) {
                this.finishGame();
            } else {
                this.correctSound.play().catch((error: Error) => console.error(error.message));
            }
        } else {
            if (isGameOver) {
                this.timer.stopTimer();
                this.disableClick = "disable-click";
                // TODO TELL THE GAMER THAT HE'S BAD
            }
        }
    }

    private handleDifferenceError(username: string): void {
        if (this.index.username === username) {
            this.errorSound.play().catch((error: Error) => console.error(error.message));
            this.errorPopup.showPopup(this.lastClick.clientX, this.lastClick.clientY);
            this.disableClick = "disable-click";
            this.blockedCursor = "cursor-not-allowed";
            setTimeout(
                () => {
                    this.errorPopup.hidePopup();
                    this.disableClick = "";
                    this.blockedCursor = "";
                },
                this.CLICK_DELAY
            );
        }
    }

    protected finishGame(): void {
        this.timer.stopTimer();
        this.disableClick = "disable-click";
        this.victorySound.play().catch((error: Error) => console.error(error.message));
    }

    protected getBack(): void {
        this.router.navigate([GAMES_LIST_PATH]).catch((error: Error) => console.error(error.message));
    }
}
