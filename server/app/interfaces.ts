import { Message } from "../../common/communication/message";
import { Router, Application, Request, Response } from "express";

export interface IndexServiceInterface {
    about(): Message;
    helloWorld(): Promise<Message>;
}

export interface DateServiceInterface {
    currentTime(): Promise<Message>;
}

export interface DateControllerInterface {
    router: Router;
}

export interface IndexControllerInterface {
    router: Router;
}

export interface ImageControllerInterface {
    router: Router;
}

export interface ImageServiceInterface {
    getDifferentImage(req: Request, res: Response): Message
}

export interface ConvertImageServiceInterface {
    bufferToImageBMP(buffer: Buffer): ImageBMP;
    imageBMPtoBuffer(imageBMP: ImageBMP, buffer: Buffer): Buffer;
}

export interface ApplicationInterface {
    app: Application;
    bindRoutes(): void;
}

export interface ServerInterface {
    init(): void;
}

export interface BMPHeader {
    fileHeader: {
        bfType: number; bfSize: number; bfReserved1: number; bfReserved2: number; bfOffBits: number;
    };
    infoHeader: {
        biSize: number; biWidth: number; biHeight: number; biPlanes: number; biBitCount: number;
        biCompression: number;
        biSizeImage: number;
        biXPelsPerMeter: number;
        biYPelsPerMeter: number;
        biClrUsed: number;
        biClrImportant: number
    };
}

export interface Pixel {
    red: number;
    green: number;
    blue: number;
}

export interface ImageBMP {
    header: BMPHeader;
    stride: number;
    width: number;
    height: number;
    pixels: Pixel[][];
}
