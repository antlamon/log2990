import { IGame3D } from "../../../common/models/game3D";

export class Identification3DService {
    public constructor(private game: IGame3D, private pos: {x: number, y: number, z: number} ) { }

}
