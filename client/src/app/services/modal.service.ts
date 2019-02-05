import { IModal } from "../models/modal";

export class ModalService {
    private modals: IModal[] = [];

    add(modal: IModal) {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    remove(id: string) {
        // remove modal from array of active modals
        this.modals = this.modals.filter(x => x.id !== id);
    }

    open(id: string) {
        // open modal specified by id
        let modal: IModal = this.modals.filter(x => x.id === id)[0];
        modal.open();
    }

    close(id: string) {
        // close modal specified by id
        let modal: IModal = this.modals.filter(x => x.id === id)[0];
        modal.close();
    }
}