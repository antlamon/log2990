import { Component, HostListener, OnDestroy, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IndexService } from "src/app/services/index.service";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage, Point } from "../../../../../common/communication/message";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IFullGame } from "../../../../../common/models/game";
import { GameService } from "../../services/game.service";
import { SocketService } from "../../services/socket.service";
import { TimerService } from "src/app/services/timer.service";

@Component({
    selector: "app-game2d-view",
    templateUrl: "./game2D-view.component.html",
    styleUrls: ["./game2D-view.component.css"]
})
export class Game2DViewComponent implements OnInit, OnDestroy {

    public simpleGame: IFullGame;
    public differencesFound: number;
    public disableClick: string;
    public blockedCursor: string;
    private readonly NB_MAX_DIFF: number = 7;

    private readonly ONE_SEC_IN_MS: number = 1000;
    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;

    public constructor(
        private gameService: GameService,
        private socket: SocketService,
        private route: ActivatedRoute,
        private index: IndexService,
        private timer: TimerService
    ) {
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
        this.differencesFound = 0;
        this.disableClick = "";
        this.blockedCursor = "";
        this.correctSound = new Audio("assets/correct.wav");
        this.errorSound = new Audio("assets/error.wav");
        this.victorySound = new Audio("assets/Ta-Da.wav");
    }

    public ngOnInit(): void {
        this.getSimpleGame();
    }

    @HostListener("window:beforeunload")
    public ngOnDestroy(): void {
        if (this.simpleGame) {
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_ROOM, this.simpleGame.card.id);
        }
    }

    private getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    private getSimpleGame(): void {
        this.gameService.getSimpleGame(this.getId())
            .subscribe((response: IFullGame) => {
                this.simpleGame = response;
                const newGameMessage: NewGameMessage = {
                    username: this.index.username,
                    gameRoomId: this.simpleGame.card.id,
                    originalImage: this.simpleGame.card.originalImage,
                    modifiedImage: this.simpleGame.modifiedImage,
                    differenceImage: this.simpleGame.differenceImage
                };
                this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);
                this.timer.startTimer();
            });
    }

    private handleCreateGameRoom(rejection?: string): void {
        if (rejection !== null) {
            alert(rejection);
        }
    }

    private handleCheckDifference(update: GameRoomUpdate): void {
        if (update.differencesFound === -1) {
            this.errorSound.play().catch((error: Error) => console.error(error.message));
            this.disableClick = "disable-click";
            this.blockedCursor = "cursor-not-allowed";
            setTimeout(
                () => {
                    this.disableClick = "";
                    this.blockedCursor = "";
                },
                this.ONE_SEC_IN_MS
            );
        } else {
            this.simpleGame.modifiedImage = update.newImage;
            this.differencesFound = update.differencesFound;
            if (this.differencesFound === this.NB_MAX_DIFF) {
                this.finishGame();
            } else {
                this.correctSound.play().catch((error: Error) => console.error(error.message));
            }
        }
    }

    private finishGame(): void {
        this.timer.stopTimer();
        this.disableClick = "disable-click";
        this.victorySound.play().catch((error: Error) => console.error(error.message));
        this.socket.emitEvent(SocketsEvents.DELETE_GAME_ROOM, this.simpleGame.card.id);
    }

    public sendClick(event: MouseEvent): void {
        const IMAGE_HEIGHT: number = 480;
        const point: Point = {
            x: event.offsetX,
            y: IMAGE_HEIGHT - event.offsetY,
        };
        const imageClickMessage: ImageClickMessage = {
            point: point,
            gameRoomId: this.simpleGame.card.id,
            username: this.index.username,
        };

        this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE, imageClickMessage);
    }
}
