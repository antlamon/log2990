import { Component } from "@angular/core";
import { Point } from "../../../../../common/communication/message";

@Component({
    selector: "app-error-popup",
    templateUrl: "./error-popup.component.html",
    styleUrls: ["./error-popup.component.css"]
})
export class ErrorPopupComponent {

    public errorPopupDisplay: string;
    public errorPopupPosition: Point;
    private readonly halfWidth: number = 35;

    public constructor() {
        this.errorPopupDisplay = "none";
    }

    public showPopup(x: number, y: number): void {
        this.errorPopupPosition = {
            x: x - this.halfWidth,
            y: y,
        };
        this.errorPopupDisplay = "block";
    }

    public hidePopup(): void {
        this.errorPopupDisplay = "none";
    }
}
