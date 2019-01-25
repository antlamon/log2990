import {fromByteArray} from "base64-js";
import { injectable } from "inversify";
import "reflect-metadata";


@injectable()
export class ConvertImage {


  public bufferToImageBMP(buffer: Buffer): ImageBMP {
          
    const header: BMPHeader = this.getHeader(buffer);

    return this.getPixels(header, buffer);
  }

  public imageBMPtoBuffer(imageBMP: ImageBMP, buffer: Buffer): Buffer {

    const offBits: number = imageBMP.header.fileHeader.bfOffBits
    for(let y = 0; y < imageBMP.height; y++) {
      for(let x=0; x< imageBMP.width; x++) {
          buffer.writeUInt8(imageBMP.pixels[y][x].blue,offBits+x*3+y*imageBMP.width*3);
          buffer.writeUInt8(imageBMP.pixels[y][x].green,offBits+x*3+y*imageBMP.width*3+1);
          buffer.writeUInt8(imageBMP.pixels[y][x].red,offBits+x*3+y*imageBMP.width*3+2);
      }
    }
    return buffer;

  }


  
  private getPixels(header: BMPHeader, buffer: Buffer): ImageBMP {
    const datav = buffer;
    const imageBMP: ImageBMP = {
      header: header,
      stride: Math.floor((header.infoHeader.biBitCount * header.infoHeader.biWidth + 31) / 32) * 4,
      width: header.infoHeader.biWidth,
      height: header.infoHeader.biHeight,
      pixels: null
    };
    const start = header.fileHeader.bfOffBits;
    const bmpData: Uint8Array = new Uint8Array(datav.buffer, start);
    for (let x = 0; x < imageBMP.height; ++x) {
      for (let y = 0; y < imageBMP.width; ++y) {

        const index2 = y * 3 + imageBMP.stride * x;
        imageBMP.pixels[x][y].red = bmpData[index2 + 2];
        imageBMP.pixels[x][y].green = bmpData[index2 + 1];
        imageBMP.pixels[x][y].blue = bmpData[index2];
      }
    }

    return imageBMP;
  }


  private getHeader(buffer: Buffer): BMPHeader {
    const datav = (buffer);
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

    export interface BMPHeader{

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
  
