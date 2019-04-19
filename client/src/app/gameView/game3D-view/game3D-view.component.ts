import { ChangeDetectorRef, Component, ElementRef, HostListener, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { AXIS, CLICK, KEYS } from "src/app/global/constants";
import { RenderService } from "src/app/scene3D/render.service";
import { IndexService } from "src/app/services/index.service";
import { SocketService } from "src/app/services/socket.service";
import { TimerService } from "src/app/services/timer.service";
import { Game3DRoomUpdate, NewGame3DMessage, Obj3DClickMessage } from "../../../../../common/communication/message";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { COMMUNICATION_ERROR, THREE_ERROR } from "../../../../../common/models/errors";
import { IGame3D } from "../../../../../common/models/game3D";
import { GameService } from "../../services/game.service";
import { GameViewComponent } from "../gameViewComponent";

@Component({
    selector: "app-game3d-view",
    templateUrl: "./game3D-view.component.html",
    styleUrls: ["./game3D-view.component.css"]
})

export class Game3DViewComponent extends GameViewComponent {

    private game3D: IGame3D;
    private _gameIsReady: boolean;

    @ViewChild("originalContainer")
    private originalContainerRef: ElementRef;

    @ViewChild("modifiedContainer")
    private modifiedContainerRef: ElementRef;

    private movementSpeed: number = 0.5;
    private press: boolean;
    private cheatModeActivated: boolean;

    public constructor(
        gameService: GameService,
        route: ActivatedRoute,
        socket: SocketService,
        timer: TimerService,
        index: IndexService,
        private render: RenderService,
        ref: ChangeDetectorRef,
        router: Router) {
        super(gameService, socket, route, index, timer, ref, router);
        this._gameIsReady = false;
        this.cheatModeActivated = false;
        this.press = false;
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
    }

    // tslint:disable-next-line:use-life-cycle-interface
    public ngOnInit(): void {
        super.ngOnInit();
        this.get3DGame();
    }

    @HostListener("window:beforeunload")
    // tslint:disable-next-line:use-life-cycle-interface
    public ngOnDestroy(): void {
        document.removeEventListener("contextmenu", (event: MouseEvent) => { event.preventDefault(); }, false);
        document.removeEventListener("keydown", this.onKeyDown, false);
        document.removeEventListener("mouseup", () => this.press = false, false);

        super.ngOnDestroy();
        this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE_3D);
        if (this.game3D) {
            this.render.stopCheatMode();
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_3D_ROOM, this.gameRoomId);
        }
    }

    protected handleCheckDifference(update: Game3DRoomUpdate): void {
        if (update.differencesFound === -1) {
            this.handleDifferenceError(update.username);
        } else {
            this.render.removeDiff(update.objName, update.diffType);
            this.handleDifferenceFound(update.username, update.differencesFound, update.isGameOver);
        }
    }

    protected finishGame(): void {
        super.finishGame();
        this.socket.emitEvent(SocketsEvents.END_GAME, {
            username: this.index.username,
            score: this.timer.getTimeAsString(),
            gameId: this.game3D.id,
            gameRoomId: this.gameRoomId,
            gameType: "free",
        });
        this.getBack();
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
                this.ref.detach();
                this.game3D = response;
                this.sendCreation();
                this.render.initialize(this.originalContainer, this.modifiedContainer, this.game3D).then(() => {
                    this._gameIsReady = true;
                    this.startGame();
                }
                ).catch(() => { throw new THREE_ERROR("error while rendering 3D game"); });
            })
            .catch(() => { throw new COMMUNICATION_ERROR("unable to get 3DGames."); });
    }

    private sendCreation(): void {
        const newGameMessage: NewGame3DMessage = {
            username: this.index.username,
            gameId: this.game3D.id,
            gameName: this.game3D.name,
            is3D: true,
            gameRoomId: this.gameRoomId,
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

        document.addEventListener("mouseup", () => this.press = false, false);
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
            gameRoomId: this.gameRoomId,
            username: this.index.username,
            name: object ? object.name : null,
        };
        this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
    }

    public get gameIsReady(): boolean {
        return this._gameIsReady;
    }
}
