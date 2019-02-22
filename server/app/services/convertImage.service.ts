import { injectable } from "inversify";
import "reflect-metadata";
import { FORMAT_ERROR } from "../../../common/models/errors";

@injectable()
export class ConvertImage {
  public static readonly ERROR_MESSAGE_WRONG_FORMAT: string = "Les images ne sont pas dans le bon format";
  public readonly VALID_BIT_COUNT: number = 24;
  private readonly HEADER_BITS: number = 32;
  private readonly BIT_SIZE: number = 4;

  public bufferToImageBMP(buffer: Buffer): ImageBMP {

    const header: BMPHeader = this.getHeader(buffer);
    if (header.infoHeader.biBitCount !== this.VALID_BIT_COUNT) {
      throw new FORMAT_ERROR(ConvertImage.ERROR_MESSAGE_WRONG_FORMAT);
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
      stride: Math.floor((header.infoHeader.biBitCount * header.infoHeader.biWidth + this.HEADER_BITS - 1)
        / this.HEADER_BITS) * this.BIT_SIZE,
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

  private getHeader(buffer: Buffer): BMPHeader {
    let index: number = 0;
    const int16Size: number = 2;
    const int32Size: number = 4;

    return {
      fileHeader: {
        bfType: buffer.readInt16LE(index, true),
        bfSize: buffer.readInt32LE(index += int16Size, true),
        bfReserved1: buffer.readInt16LE(index += int32Size, true),
        bfReserved2: buffer.readInt16LE(index += int16Size, true),
        bfOffBits: buffer.readInt32LE(index += int16Size, true),
      },
      infoHeader: {
        biSize: buffer.readInt32LE(index += int32Size, true),
        biWidth: buffer.readInt32LE(index += int32Size, true),
        biHeight: buffer.readInt32LE(index += int32Size, true),
        biPlanes: buffer.readInt16LE(index += int32Size, true),
        biBitCount: buffer.readInt16LE(index += int16Size, true),
        biCompression: buffer.readInt32LE(index += int16Size, true),
        biSizeImage: buffer.readInt32LE(index += int32Size, true),
        biXPelsPerMeter: buffer.readInt32LE(index += int32Size, true),
        biYPelsPerMeter: buffer.readInt32LE(index += int32Size, true),
        biClrUsed: buffer.readInt32LE(index += int32Size, true),
        biClrImportant: buffer.readInt32LE(index += int32Size, true),
      },
    };
  }
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
