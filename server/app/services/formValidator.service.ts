import { injectable } from "inversify";
import { FORM_ERROR, FORMAT_ERROR } from "../../../common/models/errors";
import { IGame3DForm } from "../../../common/models/game";
import { NO_MAX_OBJECTS, NO_MIN_OBJECTS } from "../../../common/models/game3D";

@injectable()
export class FormValidatorService {

    private readonly MIN_GAMENAME_LENGTH: number = 3;
    private readonly MAX_GAMENAME_LENGTH: number = 20;

    public isCorrectLength(nom: string, min: number, max: number): boolean {
        return nom.length <= max && nom.length >= min;
    }
    public containOnlyAlphaNumeric(nom: string): boolean {
        const tryRegex: RegExp = new RegExp(/^[a-zA-Z0-9]+$/i);

        return tryRegex.test(nom);
    }
    public validate3DForm(form: IGame3DForm): void {
        if (form.objectQty < NO_MIN_OBJECTS || form.objectQty > NO_MAX_OBJECTS) {
            throw new FORM_ERROR("Le nombre d'objets doit être entre 10 et 200");
        } else if (!form.modifications.add && !form.modifications.delete && !form.modifications.color) {
            throw new FORM_ERROR("Il faut choisir au moins une modification");
        } else if (!this.isValidGameName(form.name)) {
            throw new FORMAT_ERROR("Le nom doit être un alphanumérique entre 3 et 20 lettres");
        }
    }
    private isValidGameName(name: string): boolean {
        return this.isCorrectLength(name, this.MIN_GAMENAME_LENGTH, this.MAX_GAMENAME_LENGTH) && this.containOnlyAlphaNumeric(name);
    }
}
