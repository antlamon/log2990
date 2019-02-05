import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ConvertImage {
  public static readonly ERROR_MESSAGE_WRONG_FORMAT: string = "Les images ne sont pas dans le bon format";
  public readonly VALID_BIT_COUNT: number = 24;

  public bufferToImageBMP(buffer: Buffer): ImageBMP {

    const header: BMPHeader = this.getHeader(buffer);
    if (header.infoHeader.biBitCount !== this.VALID_BIT_COUNT) {
      throw Error(ConvertImage.ERROR_MESSAGE_WRONG_FORMAT);
    }

    return this.getPixels(header, buffer);
  }

  public imageBMPtoBuffer(imageBMP: ImageBMP, buffer: Buffer): Buffer {

    const offBits: number = imageBMP.header.fileHeader.bfOffBits;
    const stride: number = imageBMP.stride;
    for (let y: number = 0; y < imageBMP.height; y++) {
      for (let x: number = 0; x < imageBMP.width; x++) {
        buffer.writeUInt8(imageBMP.pixels[y][x].blue, offBits + x * 3 + y * stride);
        buffer.writeUInt8(imageBMP.pixels[y][x].green, offBits + x * 3 + y * stride + 1);
        buffer.writeUInt8(imageBMP.pixels[y][x].red, offBits + x * 3 + y * stride + 2);
      }
    }

    return buffer;

  }

  private getPixels(header: BMPHeader, buffer: Buffer): ImageBMP {
    const imageBMP: ImageBMP = {
      header: header,
      // tslint:disable-next-line:no-magic-numbers
      stride: Math.floor((header.infoHeader.biBitCount * header.infoHeader.biWidth + 31) / 32) * 4,
      width: header.infoHeader.biWidth,
      height: header.infoHeader.biHeight,
      pixels: [],
    };

    const start: number = header.fileHeader.bfOffBits;
    for (let y: number = 0; y < imageBMP.height; ++y) {
      imageBMP.pixels[y] = [];
      for (let x: number = 0; x < imageBMP.width; ++x) {

        const index2: number = x * 3 + imageBMP.stride * y + start;

        imageBMP.pixels[y][x] = {} as Pixel;
        imageBMP.pixels[y][x].red = buffer.readUInt8(index2 + 2);
        imageBMP.pixels[y][x].green = buffer.readUInt8(index2 + 1);
        imageBMP.pixels[y][x].blue = buffer.readUInt8(index2);
      }
    }

    return imageBMP;
  }

  // tslint:disable:no-magic-numbers
  private getHeader(buffer: Buffer): BMPHeader {
    return {
      fileHeader: {
        bfType: buffer.readInt16LE(0, true),
        bfSize: buffer.readInt32LE(2, true),
        bfReserved1: buffer.readInt16LE(6, true),
        bfReserved2: buffer.readInt16LE(8, true),
        bfOffBits: buffer.readInt32LE(10, true),
      },
      infoHeader: {
        biSize: buffer.readInt32LE(14, true),
        biWidth: buffer.readInt32LE(18, true),
        biHeight: buffer.readInt32LE(22, true),
        biPlanes: buffer.readInt16LE(26, true),
        biBitCount: buffer.readInt16LE(28, true),
        biCompression: buffer.readInt32LE(30, true),
        biSizeImage: buffer.readInt32LE(34, true),
        biXPelsPerMeter: buffer.readInt32LE(38, true),
        biYPelsPerMeter: buffer.readInt32LE(42, true),
        biClrUsed: buffer.readInt32LE(46, true),
        biClrImportant: buffer.readInt32LE(50, true),
      },
    };
  }
  // tslint:enable
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
