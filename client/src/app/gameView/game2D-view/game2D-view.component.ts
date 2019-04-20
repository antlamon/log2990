import { ChangeDetectorRef, Component, HostListener } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IndexService } from "src/app/services/index.service";
import { TimerService } from "src/app/services/timer.service";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage, Point } from "../../../../../common/communication/message";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IFullGame } from "../../../../../common/models/game";
import { GameService } from "../../services/game.service";
import { SocketService } from "../../services/socket.service";
import { ModalService } from "src/app/services/modal.service";
import { GameViewComponent } from "../gameViewComponent";

@Component({
    selector: "app-game2d-view",
    templateUrl: "./game2D-view.component.html",
    styleUrls: ["./game2D-view.component.css"]
})
export class Game2DViewComponent extends GameViewComponent {

    private simpleGame: IFullGame;

    public constructor(
        gameService: GameService,
        socket: SocketService,
        route: ActivatedRoute,
        index: IndexService,
        timer: TimerService,
        ref: ChangeDetectorRef,
        router: Router,
        modalService: ModalService
    ) {
        super(gameService, socket, route, index, timer, ref, router, modalService);
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
    }

    // tslint:disable-next-line:use-life-cycle-interface
    public ngOnInit(): void {
        super.ngOnInit();
        this.getSimpleGame();
    }

    @HostListener("window:beforeunload")
    // tslint:disable-next-line:use-life-cycle-interface
    public ngOnDestroy(): void {
        super.ngOnDestroy();
        this.socket.unsubscribeTo(SocketsEvents.CHECK_DIFFERENCE);
        if (this.simpleGame) {
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_ROOM, { gameRoomId: this.gameRoomId, username: this.index.username });
        }
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

    protected handleCheckDifference(update: GameRoomUpdate): void {
        if (update.differencesFound === -1) {
            this.handleDifferenceError(update.username);
        } else {
            this.simpleGame.modifiedImage = update.newImage;
            this.handleDifferenceFound(update.username, update.differencesFound, update.isGameOver);
        }
    }

    protected finishGame(): void {
        super.finishGame();
        this.socket.emitEvent(SocketsEvents.END_GAME, {
            username: this.index.username,
            score: this.timer.getTimeAsString(),
            gameId: this.simpleGame.card.id,
            gameType: "simple",
            gameRoomId: this.gameRoomId,
        });
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
}
