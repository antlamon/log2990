import { Component, OnInit } from "@angular/core";
import { GameService } from "../../services/game.service";
import { SocketService } from "../../services/socket.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { IGame } from "../../../../../common/models/game";
import { ActivatedRoute } from "@angular/router";
import { GameRoomUpdate, Point, ImageClickMessage } from "../../../../../common/communication/message";

@Component({
    selector: "app-game-view",
    templateUrl: "./game-view.component.html",
    styleUrls: ["./game-view.component.css"]
})
export class GameViewComponent implements OnInit {

    public simpleGame: IGame;
    public differencesFound: number;

    private correctSound: HTMLAudioElement;
    private errorSound: HTMLAudioElement;

    public constructor(
        private gameService: GameService,
        private socket: SocketService,
        private route: ActivatedRoute
    ) {
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE, this.handleCheckDifference.bind(this));
        this.differencesFound = 0;
        this.correctSound = new Audio();
        this.correctSound.src = "assets/correct.wav";
        this.errorSound = new Audio();
        this.errorSound.src = "assets/error.wav";
    }

    public ngOnInit(): void {
        this.getSimpleGame();
    }

    private getId(): string {

        return String(this.route.snapshot.paramMap.get("id"));
    }

    public getSimpleGame(): void {
        this.gameService.getSimpleGame(this.getId())
            .then((response: IGame) => {
                this.simpleGame = response[0];
                this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, {
                    originalImagePath: "./app/documents/test-images/image_test_1.bmp",
                    modifiedImagePath: "./app/documents/test-images/image_test_2.bmp",
                    differenceImagePath: "./app/documents/test-images/image_result.bmp",
                    username: "alloa",
                    gameRoomId: this.simpleGame.id,
                });
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
            console.log("noDif");
            this.errorSound.play();
        } else {
            console.log("what");
            this.simpleGame["modifiedImageURL"] = update.newImage;
            this.differencesFound = update.differencesFound;
            this.correctSound.play();
        }
    }

    public sendClick(event: MouseEvent): void {
        console.log(event);
        const IMAGE_HEIGHT: number = 480;
        const point: Point = {
            x: event.offsetX,
            y: IMAGE_HEIGHT - event.offsetY,
        };
        const imageClickMessage: ImageClickMessage = {
            point: point,
            gameRoomId: this.simpleGame.id,
            username: "alloa",
        };

        this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE, imageClickMessage);
    }

}
