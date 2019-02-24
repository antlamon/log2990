import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { IndexService } from "src/app/services/index.service";
import { GameRoomUpdate, ImageClickMessage, NewGameMessage, Point } from "../../../../../common/communication/message";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IFullGame } from "../../../../../common/models/game";
import { GameService } from "../../services/game.service";
import { SocketService } from "../../services/socket.service";

@Component({
  selector: "app-game2d-view",
  templateUrl: "./game2D-view.component.html",
  styleUrls: ["./game2D-view.component.css"]
})
export class Game2DViewComponent implements OnInit {

    public simpleGame: IFullGame;
    public differencesFound: number;

    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;

    public constructor(
        private gameService: GameService,
        private socket: SocketService,
        private route: ActivatedRoute,
        private index: IndexService
    ) {
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
        this.differencesFound = 0;
        this.correctSound = new Audio("assets/correct.wav");
        this.errorSound = new Audio("assets/error.wav");
    }

    public ngOnInit(): void {
        this.getSimpleGame();
    }

    private getId(): string {
        return String(this.route.snapshot.paramMap.get("id"));
    }

    public getSimpleGame(): void {
        this.gameService.getSimpleGame(this.getId())
            .then((response: IFullGame) => {
                this.simpleGame = response;
                const newGameMessage: NewGameMessage =  {
                    username: this.index.username,
                    gameRoomId: this.simpleGame.card.id,
                    originalImage: this.simpleGame.card.originalImage,
                    modifiedImage: this.simpleGame.modifiedImage,
                    differenceImage: this.simpleGame.differenceImage
                };
                this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);
            })
            .catch (() => "getSimpleGame");
    }

    public handleCreateGameRoom(rejection?: string): void {
        if (rejection !== undefined) {
            // error modal
        }
    }

    public handleCheckDifference(update: GameRoomUpdate): void {
        if (update.differencesFound === -1) {
            // not a difference
            this.errorSound.play();
        } else {
            this.simpleGame.modifiedImage = update.newImage;
            this.differencesFound = update.differencesFound;
            this.correctSound.play();
        }
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
