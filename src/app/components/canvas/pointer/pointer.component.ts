import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { fromEvent } from 'rxjs';
import { throttleTime } from 'rxjs/operators';
import { CanvasLayer } from 'src/app/models/canvas-layer.class';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { IPointerCanvasPixel } from 'src/app/interfaces/pointer-canvas.interface';

@Component({
  selector: 'app-pointer',
  templateUrl: './pointer.component.html',
  styleUrls: ['./pointer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PointerComponent implements OnInit {
  _rates: IJSONPoint[];
  @Input('rates')
  set rates(val: IJSONPoint[]) {
    this._rates = val;
    if (this.initialized) {
      this.recalculatePixelMatrix();
    }
  }
  get rates(): IJSONPoint[] {
    return this._rates;
  }

  pointerCanvas: CanvasLayer = new CanvasLayer({idSelector: 'pointer'});

  initialized = false; // Индикатор, инициализирован ли компонент.

  @ViewChild('pointer') pointer: ElementRef;

  pixelMatrix: IPointerCanvasPixel[];

  constructor() {}

  ngOnInit() {
    this.initialized = true;
    fromEvent(this.pointer.nativeElement, 'mousemove')
      .pipe(throttleTime(1000))
      .subscribe(e => this.drawPointer(e as MouseEvent));
    this.pointerCanvas.domElement = this.pointer.nativeElement as HTMLCanvasElement;
    console.log(this.pointer);
  }

  drawPointer(event: MouseEvent) {
    const ctx = this.pointerCanvas.domElement.getContext('2d');
    ctx.clearRect(0, 0, this.pointerCanvas.width, this.pointerCanvas.height);
    const realCanvasWidth = this.pointerCanvas.width - this.pointerCanvas.right - this.pointerCanvas.left;
    const realCanvasHeight = this.pointerCanvas.height - this.pointerCanvas.top - this.pointerCanvas.bottom;
    const CanvasYAxisZero = this.pointerCanvas.top + realCanvasHeight;
    const CanvasYAxisMax = this.pointerCanvas.top;
    const X = event.offsetX;
    const Y = event.offsetY;
    console.log(event);
    this.drawPointUnderCursor(ctx, X, Y);
  }

  drawPointUnderCursor(ctx: CanvasRenderingContext2D, x: number, y: number) {
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#f6f7f8';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, 4, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#74a3c7';
    ctx.fill();
  }

  recalculatePixelMatrix() {

  }
}
