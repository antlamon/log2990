import { AfterViewInit, Component, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import {RenderService} from './render.service';
import { Game3D } from "../../../../../common/models/game3D";
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-scene3-d-component',
  templateUrl: './scene3-d.component.html',
  styleUrls: ['./scene3-d.component.css']
})

export class Scene3DComponent implements AfterViewInit, OnInit {

  public games3D: Game3D[];

  public constructor(private gameService: GameService, private renderService: RenderService) {};

  ngOnInit(): void {
  }

  private get container(): HTMLDivElement {
    return this.containerRef.nativeElement;
  }

  @ViewChild('container')
  private containerRef: ElementRef;

  @HostListener('window:resize', ['$event'])
  public onResize() {
    this.renderService.onResize();
  }
  public ngAfterViewInit() {
    this.gameService.getFreeGames()
    .subscribe((response: Game3D[]) => {
      this.games3D = response;
      this.renderService.initialize(this.container, this.games3D[0]);
    });
  }
}
