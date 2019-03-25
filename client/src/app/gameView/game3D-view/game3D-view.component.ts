import { Component, OnInit, ViewChild, ElementRef, HostListener, OnDestroy } from "@angular/core";
import { GameService } from "../../services/game.service";
import { ActivatedRoute } from "@angular/router";
import { IGame3D } from "../../../../../common/models/game3D";
import { RenderService } from "src/app/scene3D/scene3-d/render.service";
import { SocketService } from "src/app/services/socket.service";
import { IndexService } from "src/app/services/index.service";
import { SocketsEvents } from "../../../../../common/communication/socketsEvents";
import { Game3DRoomUpdate, NewGame3DMessage, Obj3DClickMessage } from "../../../../../common/communication/message";
import { CLICK, KEYS } from "src/app/global/constants";

@Component({
    selector: "app-game3d-view",
    templateUrl: "./game3D-view.component.html",
    styleUrls: ["./game3D-view.component.css"]
})
export class Game3DViewComponent implements OnInit, OnDestroy {

    @ViewChild("originalContainer")
    private originalContainerRef: ElementRef;

    @ViewChild("modifiedContainer")
    private modifiedContainerRef: ElementRef;

    private movementSpeed: number = 3;
    private press: boolean;
    private roomID: string;
    private cheatModeActivated: boolean;
    public game3D: IGame3D;
    public gameIsReady: boolean;

    public constructor(
        private gameService: GameService,
        private route: ActivatedRoute,
        private render: RenderService,
        private socket: SocketService,
        private index: IndexService) {
        this.gameIsReady = false;
        this.cheatModeActivated  = false;
        this.press = false;
        this.socket.addEvent(SocketsEvents.CREATE_GAME_ROOM, this.handleCreateGameRoom.bind(this));
        this.socket.addEvent(SocketsEvents.CHECK_DIFFERENCE_3D, this.handleCheckDifference.bind(this));
     }

    public ngOnInit(): void {
        this.get3DGame();
    }

    @HostListener("window:beforeunload")
    public ngOnDestroy(): void {
        if (this.game3D) {
            this.socket.emitEvent(SocketsEvents.DELETE_GAME_3D_ROOM, this.roomID);
        }
    }
    private handleCreateGameRoom(rejection?: string): void {
        if (rejection !== null) {
            alert(rejection);
        }
      }
    private handleCheckDifference(update: Game3DRoomUpdate): void {
        if (update.differencesFound !== -1) {
          this.render.removeDiff(update.objName, update.diffType);
        }
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
            .then( (response: IGame3D) => {
                this.game3D = response;
                this.sendCreation();
                this.render.initialize(this.originalContainer, this.modifiedContainer, this.game3D).then(() => {
                this.gameIsReady = true;
                this.startGame();
                }
                );
            })
            .catch(() => "get3DGame");
        }
    private sendCreation(): void {
        this.roomID = this.game3D.id;
        const newGameMessage: NewGame3DMessage = {
            username: this.index.username,
            gameRoomId: this.roomID,
            is3D: true,
            differences: this.game3D.differences
          };
        this.socket.emitEvent(SocketsEvents.CREATE_GAME_ROOM, newGameMessage);
    }
    private startGame(): void {
        document.addEventListener( "keydown", this.onKeyDown, false );
        this.addFunctions();
        this.render.startRenderingLoop();
    }
    private addFunctions(): void {
        this.render.addListener( "mousemove", this.onMouseMove);
        this.render.addListener( "contextmenu", (event: MouseEvent) => { event.preventDefault(); });
        this.render.addListener("mousedown", this.onMouseDown);
        this.render.addListener("mouseup", this.onMouseUp);
    }

    private onKeyDown = (event: KeyboardEvent) => {
        switch (event.keyCode ) {
          case KEYS["S"]: // up
            this.render.moveCam( "Z", this.movementSpeed);
            break;
          case KEYS["W"]: // down
            this.render.moveCam( "Z", -this.movementSpeed);
            break;
          case KEYS["D"]: // up
            this.render.moveCam( "X", this.movementSpeed);
            break;
          case KEYS["A"]: // down
            this.render.moveCam( "X", -this.movementSpeed);
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
        this.render.rotateCam("Y", event.movementX);
        this.render.rotateCam("X", event.movementY);
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
        const intersects: THREE.Intersection[] = this.render.identifyDiff(event);
        if (intersects.length > 0) {
            const objMessage: Obj3DClickMessage = {
            gameRoomId: this.roomID,
            username: this.index.username,
            name: intersects[0].object.name,
            };
            this.socket.emitEvent(SocketsEvents.CHECK_DIFFERENCE_3D, objMessage);
        }
    }
}
