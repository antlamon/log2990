import { Message } from "../../../common/communication/message";
import { inject, injectable } from "inversify";
import "reflect-metadata";
import { ConvertImage } from "./convertImage.service";
import Types from "../types"

@injectable()
export class ImageService {

    public constructor(@inject(Types.ConvertImage) private convertImage: ConvertImage) {}

    getDifferentImage(req: Request, res: Response ) {

        


    }

}
