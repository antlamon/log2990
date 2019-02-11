import { AfterViewInit, Component, ElementRef, ViewChild, HostListener } from '@angular/core';
import {RenderService} from './render.service';

@Component({
  selector: 'app-scene3-d-component',
  templateUrl: './scene3-d.component.html',
  styleUrls: ['./scene3-d.component.css']
})

export class Scene3DComponent implements AfterViewInit {

  public constructor(private renderService: RenderService) {
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
    this.renderService.initialize(this.container);
  }
}
