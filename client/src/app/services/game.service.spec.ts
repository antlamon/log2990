import { TestBed, inject } from "@angular/core/testing";

import { GameService } from "./game.service";
import { HttpClientModule } from "@angular/common/http";
import { IGame, ISimpleForm, IGame3DForm, IFullGame } from "../../../../common/models/game";
import { Message, BASE_ID } from "../../../../common/communication/message";
import { TestHelper } from "src/test.helper";
import { IGame3D } from "../../../../common/models/game3D";

describe("GameService", () => {
    const mockedID: string = "mockedId";
    const mocked3DGame: IGame3D = { name: "testGame" } as IGame3D;
    const mocked2DGame: IGame = { name: "testGame" } as IGame;

    // tslint:disable-next-line:no-any Used to mock the http call
    let httpSpy: any;
    let gameService: GameService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [GameService]
        });
        httpSpy = jasmine.createSpyObj("HttpClient", ["get", "post", "delete"]);
        gameService = new GameService(httpSpy);
    });

    it("should be created", inject([GameService], (service: GameService) => {
        expect(service).toBeTruthy();
    }));

    it("Getting simple games should return simple games", () => {
        const expectedGames: IGame[] = [
            { name: "test1" } as IGame,
            { name: "test2" } as IGame,
        ];
        httpSpy.get.and.returnValue(TestHelper.asyncData(expectedGames));
        gameService.getSimpleGames().subscribe(
            (response: IGame[]) => {
                expect(response).toEqual(expectedGames);
            }
        );
    });

    it("Getting a simple game should return a simple game", () => {
        const expectedGame: IFullGame = {
            card: { name: "test1", id: mockedID} as IGame,
            modifiedImage: "modif",
            differenceImage: "diff"
        };
        httpSpy.get.and.returnValue(TestHelper.asyncData(expectedGame));
        gameService.getSimpleGame(mockedID).subscribe(
            (response: IFullGame) => {
                expect(response).toEqual(expectedGame);
            }
        );
    });

    it("Getting free games should return free games", () => {
        const expectedGames: IGame3D[] = [
            { name: "test1" } as IGame3D,
            { name: "test2" } as IGame3D,
        ];
        httpSpy.get.and.returnValue(TestHelper.asyncData(expectedGames));
        gameService.getFreeGames().subscribe(
            (response: IGame3D[]) => {
                expect(response).toEqual(expectedGames);
            }
        );
    });

    it("Getting a 3D game should return a 3D game", () => {
        const expectedGame: IGame3D = mocked3DGame;
        httpSpy.get.and.returnValue(TestHelper.asyncData(expectedGame));
        gameService.get3DGame(mockedID).then(
            (response: IGame3D) => {
                expect(response).toEqual(expectedGame);
            }
        ).catch((error: Error) => fail(error));
    });

    it("Creating simple games should send a post", () => {
        const game: ISimpleForm = {
            name: "testGame",
            originalImage: {name: "original"} as File,
            modifiedImage: {name: "modified"} as File,
        };
        httpSpy.post.and.returnValue(TestHelper.asyncData(0));
        gameService.createSimpleGame(game);
        expect(httpSpy.post.calls.count()).toBe(1);
    });

    it("Creating free games should send a post", () => {
        httpSpy.post.and.returnValue(TestHelper.asyncData(0));
        const game: IGame3DForm = {
            name: "testGame"
        } as IGame3DForm;
        gameService.createFreeGame(game);
        expect(httpSpy.post.calls.count()).toBe(1);
    });

    it("Deleting simple games should return expected message", () => {
        const expectedMessage: Message = {
            title: BASE_ID,
            body: "Deleted Test"
        };
        httpSpy.delete.and.returnValue(TestHelper.asyncData(expectedMessage));
        gameService.deleteSimpleGame(mocked2DGame).subscribe(
            (response: Message) => {
                expect(response).toEqual(expectedMessage);
            }
        );
    });

    it("Deleting free games should return expected message", () => {
        const expectedMessage: Message = {
            title: BASE_ID,
            body: "Deleted Test"
        };
        httpSpy.delete.and.returnValue(TestHelper.asyncData(expectedMessage));
        gameService.deleteFreeGame(mocked3DGame).subscribe(
            (response: Message) => {
                expect(response).toEqual(expectedMessage);
            }
        );
    });
});
