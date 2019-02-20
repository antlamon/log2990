import { readFileSync } from "fs";
import { inject, injectable } from "inversify";
import { Point } from "../../../common/communication/message";
import { TYPES } from "../types";
import { ConvertImage, ImageBMP } from "./convertImage.service";
import { IdentificationService } from "./identification.service";

interface IDictionary {
    [index: string]: IdentificationService;
}

@injectable()
export class IdentificationServiceManager {

    public static readonly IDENTIFICATION_SERVICE_NOT_FOUND: string = "Le service d'identification pour ce jeu n'est pas instancié";
    public static readonly NO_DIFFERENCE_FOUND: string = "Aucune différence trouvée";
    public static readonly GAMEID_ALREADY_EXISTS: string = "Le service avec ce gameId existe deja";

    private identificationServices: IDictionary;
    private bmpBufferFormat: Buffer;

    public constructor(@inject(TYPES.ConvertImage) private convertImage: ConvertImage) {
        this.identificationServices = {} as IDictionary;
    }

    public getDifference(gameId: string, point: Point): string {
        if (this.identificationServices[gameId] === undefined) {
            return `${IdentificationServiceManager.IDENTIFICATION_SERVICE_NOT_FOUND}, GameId: ${gameId}`;
        }
        const image: ImageBMP | null = this.identificationServices[gameId].getDifference(point);
        if (image === null) {
            return IdentificationServiceManager.NO_DIFFERENCE_FOUND;
        }

        return this.imageToString64(this.convertImage.imageBMPtoBuffer(image, this.bmpBufferFormat));
    }

    public startNewService(gameId: string, originalImagePath: string, modifiedImagePath: string, differenceImagePath: string): string {
        if (this.identificationServices[gameId] !== undefined) {
            return `${IdentificationServiceManager.GAMEID_ALREADY_EXISTS}, gameId:${gameId}`;
        }

        const originalBuffer: Buffer = readFileSync(originalImagePath);
        if (this.bmpBufferFormat === undefined) {
            this.bmpBufferFormat = originalBuffer;
        }
        const originalImage: ImageBMP = this.convertImage.bufferToImageBMP(originalBuffer);
        const modifiedImage: ImageBMP = this.convertImage.bufferToImageBMP(readFileSync(modifiedImagePath));
        const differenceImage: ImageBMP = this.convertImage.bufferToImageBMP(readFileSync(differenceImagePath));
        this.identificationServices[gameId] = new IdentificationService(originalImage, modifiedImage, differenceImage);

        return "";
    }

    private imageToString64(buffer: Buffer): string {
        return "data:image/bmp;base64," + buffer.toString("base64");
    }
}
