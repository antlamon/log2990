import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from "@angular/core";
import { GameService } from "../../services/game.service";
import { ActivatedRoute, Router } from "@angular/router";
import { IGame3D } from "../../../../../common/models/game3D";
import { RenderService } from "src/app/scene3D/render.service";
import { SocketService } from "src/app/services/socket.service";
import { IndexService } from "src/app/services/index.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { Game3DRoomUpdate, NewGame3DMessage, Obj3DClickMessage } from "../../../../../common/communication/message";
import { CLICK, KEYS, AXIS } from "src/app/global/constants";
import { ErrorPopupComponent } from "../error-popup/error-popup.component";
import { TimerService } from "src/app/services/timer.service";
import { COMMUNICATION_ERROR, THREE_ERROR } from "../../../../../common/models/errors";

@Component({
    selector: "app-game3d-view",
    templateUrl: "./game3D-view.component.html",
    styleUrls: ["./game3D-view.component.css"]
})
export class Game3DViewComponent implements OnInit, OnDestroy {

    private game3D: IGame3D;
    private _gameIsReady: boolean;
    private differencesFound: number;
    private _disableClick: string;
    private _blockedCursor: string;

    private readonly ONE_SEC_IN_MS: number = 1000;
    private readonly NB_MAX_DIFF: number = 7;

    @ViewChild("originalContainer")
    private originalContainerRef: ElementRef;

    @ViewChild("modifiedContainer")
    private modifiedContainerRef: ElementRef;

    @ViewChild(ErrorPopupComponent)
    private errorPopup: ErrorPopupComponent;
    private lastClick: MouseEvent;

    private movementSpeed: number = 0.5;
    private press: boolean;
    private roomID: string;
    private cheatModeActivated: boolean;
    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;
    private victorySound: HTMLAudioElement;

    public constructor(
        private gameService: GameService,
        private route: ActivatedRoute,
        private socket: SocketService,
        private timer: TimerService,
        private index: IndexService,
        private render: RenderService,
        private router: Router) {
        if (!this.index.username) {
            this.router.navigate([""]);
        }
        this._gameIsReady = false;
        this.cheatModeActivated = false;
        this.press = false;
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
        this.correctSound = new Audio("assets/correct.wav");
        this.errorSound = new Audio("assets/error.wav");
        this.victorySound = new Audio("assets/Ta-Da.wav");
        this.differencesFound = 0;
        this._disableClick = "";
        this._blockedCursor = "";
    }

    public ngOnInit(): void {
        this.timer.setToZero();
        this.get3DGame();
    }

    @HostListener("window:beforeunload")
    public ngOnDestroy(): void {
        this.socket.unsubscribeTo(SocketsEvents.CREATE_GAME_ROOM);
        this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE_3D);
        if (this.game3D) {
            this.render.stopCheatMode();
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_3D_ROOM, this.roomID);
        }
    }
    private handleCreateGameRoom(rejection?: string): void {
        if (rejection !== null) {
            alert(rejection);
        }
        this.timer.startTimer();
    }
    private handleCheckDifference(update: Game3DRoomUpdate): void {
        if (update.differencesFound === -1) {
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
                this.ONE_SEC_IN_MS
            );
        } else {
            this.render.removeDiff(update.objName, update.diffType);
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
        this._disableClick = "disable-click";
        this.victorySound.play().catch((error: Error) => console.error(error.message));
        this.socket.emitEvent(SocketsEvents.END_GAME, {
            username: this.index.username,
            score: this.timer.getTimeAsString(),
            gameId: this.game3D.id,
            gameType: "free",
        });
        this.getBack();
    }
    private getBack(): void {
        this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
    }

    private getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    private get originalContainer(): HTMLDivElement {
        return this.originalContainerRef.nativeElement;
    }

    private get modifiedContainer(): HTMLDivElement {
        return this.modifiedContainerRef.nativeElement;
    }

    public get3DGame(): void {
        this.gameService.get3DGame(this.getId())
            .then((response: IGame3D) => {
                this.game3D = response;
                this.sendCreation();
                this.render.initialize(this.originalContainer, this.modifiedContainer, this.game3D).then(() => {
                    this._gameIsReady = true;
                    this.startGame();
                }
                ).catch(() => {throw new THREE_ERROR("error while rendering 3D game"); });
            })
            .catch(() => {throw new COMMUNICATION_ERROR("unable to get 3DGames."); });
    }
    private sendCreation(): void {
        this.roomID = this.game3D.id;
        const newGameMessage: NewGame3DMessage = {
            username: this.index.username,
            gameRoomId: this.roomID,
            gameName: this.game3D.name,
            is3D: true,
            differences: this.game3D.differences
        };
        this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);
    }
    private startGame(): void {
        this.addFunctions();
        this.render.startRenderingLoop();
    }
    private addFunctions(): void {
        document.addEventListener("contextmenu", (event: MouseEvent) => { event.preventDefault(); }, false);
        document.addEventListener("keydown", this.onKeyDown, false);
        this.render.addListener("mousemove", this.onMouseMove);
        this.render.addListener("mousedown", this.onMouseDown);
        this.render.addListener("mouseup", this.onMouseUp);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.keyCode) {
            case KEYS["S"]:
                this.render.moveCam(AXIS.Z, this.movementSpeed);
                break;
            case KEYS["W"]:
                this.render.moveCam(AXIS.Z, -this.movementSpeed);
                break;
            case KEYS["D"]:
                this.render.moveCam(AXIS.X, this.movementSpeed);
                break;
            case KEYS["A"]:
                this.render.moveCam(AXIS.X, -this.movementSpeed);
                break;
            case KEYS["T"]:
                this.cheatModeActivated = !this.cheatModeActivated;
                if (this.cheatModeActivated) {
                    this.render.startCheatMode();
                } else {
                    this.render.stopCheatMode();
                }
                break;
            default: break;
        }
    }
    private onMouseMove = (event: MouseEvent) => {
        if (!this.press) { return; }
        this.render.rotateCam(AXIS.Y, event.movementX);
        this.render.rotateCam(AXIS.X, event.movementY);
    }

    private onMouseUp = (event: MouseEvent) => {

        switch (event.button) {
            case (CLICK.right):
                this.press = false;
                break;
            case (CLICK.left):
                this.identifyDiff(event);
                break;
            default:
        }
    }
    private onMouseDown = (event: MouseEvent) => {
        if (event.button === CLICK.right) {
            this.press = true;
        }
    }
    private identifyDiff(event: MouseEvent): void {
        const object: THREE.Object3D | null = this.render.identifyDiff(event);
        this.lastClick = event;
        const objMessage: Obj3DClickMessage = {
            gameRoomId: this.roomID,
            username: this.index.username,
            name: object ? object.name : null,
        };
        this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
    }
    public get gameIsReady(): boolean {
        return this._gameIsReady;
    }
    public get disableClick(): string {
        return this._disableClick;
    }
    public get blockedCursor(): string {
        return this._blockedCursor;
    }
}
