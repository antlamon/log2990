export class ModalService {
    private modals: any[] = [];

    public add(modal: any): void {
        // add modal to array of active modals
        this.modals.push(modal);
    }

    public remove(id: string): void {
        // remove modal from array of active modals
        this.modals = this.modals.filter((x) => x.id !== id);
    }

    public open(id: string): void {
        // open modal specified by id
        const modal: any = this.modals.filter((x) => x.id === id)[0];
        modal.open();
    }

    public close(id: string): void {
        // close modal specified by id
        const modal: any = this.modals.filter((x) => x.id === id)[0];
        modal.close();
    }
}
