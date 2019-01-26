import { fromByteArray } from "base64-js";
import { injectable } from "inversify";
import "reflect-metadata";

@injectable()
export class ConvertImage {

  public bufferToImageBMP(buffer: Buffer): ImageBMP {

    const header: BMPHeader = this.getHeader(buffer);

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
    const datav: Buffer = buffer;
    const imageBMP: ImageBMP = {
      header: header,
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

  private getHeader(buffer: Buffer): BMPHeader {
    const datav: Buffer = (buffer);
    const header: BMPHeader = {
      fileHeader: {
        bfType: datav.readInt16LE(0, true),
        bfSize: datav.readInt32LE(2, true),
        bfReserved1: datav.readInt16LE(6, true),
        bfReserved2: datav.readInt16LE(8, true),
        bfOffBits: datav.readInt32LE(10, true),
      },
      infoHeader: {
        biSize: datav.readInt32LE(14, true),
        biWidth: datav.readInt32LE(18, true),
        biHeight: datav.readInt32LE(22, true),
        biPlanes: datav.readInt16LE(26, true),
        biBitCount: datav.readInt16LE(28, true),
        biCompression: datav.readInt32LE(30, true),
        biSizeImage: datav.readInt32LE(34, true),
        biXPelsPerMeter: datav.readInt32LE(38, true),
        biYPelsPerMeter: datav.readInt32LE(42, true),
        biClrUsed: datav.readInt32LE(46, true),
        biClrImportant: datav.readInt32LE(50, true)
      },
    };

    return header;
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
