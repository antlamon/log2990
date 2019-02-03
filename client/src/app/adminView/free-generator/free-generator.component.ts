import { Component, OnInit, ElementRef, Input, OnDestroy } from "@angular/core";
import { GameService } from "src/app/game.service";
import { ModalService } from "src/app/modal.service";

@Component({
  selector: "app-free-generator",
  templateUrl: "./free-generator.component.html",
  styleUrls: ["./free-generator.component.css"]
})
export class FreeGeneratorComponent implements OnInit, OnDestroy {

  private element: any;
  @Input() id: string;

  public constructor(private gameService: GameService,
    public el: ElementRef, private modal: ModalService) {
      this.element = el.nativeElement;
  }

  public ngOnInit() {
    let modal = this;
    if(!this.id){
      console.error("modal must have an id");
      return;
    }
    
    document.body.appendChild(this.element);

    this.element.addEventListener("click", function(e: any) {
      if(e.target.className === "modal"){
        modal.submit();  
      }
    });

    this.modal.add(this);
  }

  public ngOnDestroy(): void{
    this.modal.remove(this.id);
    this.element.remove();

  }
  public submit() {
    // submit form ... TODO sprint 2
    let newGame = {
      name: "NouveauJeu", imageURL: "nouveauTest.bmp",
      solo: { first: 9999, second: 9999, third: 9999 },
      multi: { first: 9999, second: 9999, third: 9999 }
    };//for tests

    this.gameService.createFreeGame(newGame);
    this.close();
  }

  public open(): void {
    this.element.style.display = "block";
    document.body.classList.add("modal-open");

  }

  public close(): void {
    this.element.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}
