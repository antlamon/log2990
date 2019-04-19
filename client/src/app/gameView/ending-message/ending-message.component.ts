import { Component, OnInit, OnDestroy, ElementRef, Input } from "@angular/core";
import { IModal } from "src/app/models/modal";
import { ModalService } from "src/app/services/modal.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-ending-message",
  templateUrl: "./ending-message.component.html",
  styleUrls: ["./ending-message.component.css"]
})
export class EndingMessageComponent implements OnInit, OnDestroy, IModal {

  private element: HTMLElement;
  private modalRef: EndingMessageComponent;

  @Input() public id: string;
  @Input() public isSoloGame: boolean;
  @Input() public isMultGame: boolean;
  @Input() public isWin: boolean;

  public constructor(private modalService: ModalService, private router: Router, public el: ElementRef) {
    this.element = el.nativeElement;
  }

  public ngOnInit(): void {
    this.initModal();
  }

  public ngOnDestroy(): void {
    this.modalService.remove(this.id);
    this.element.remove();
  }

  private initModal(): void {
    this.modalRef = this;

    this.element.addEventListener("click", (event: Event) => {
      if (event.constructor.name === "modal") {
        this.modalRef.submit();
      }
    });

    this.modalService.add(this);
  }

  public open(): void {
    this.element.style.display = "block";
  }

  public close(): void {
    this.element.style.display = "none";
  }

  public submit(): void {
    this.router.navigate(["games"]).catch((error: Error) => console.error(error.message));
  }

}
