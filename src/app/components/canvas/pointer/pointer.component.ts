import {
  Component,
  OnInit,
  Input,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { CanvasLayer } from 'src/app/models/canvas-layer.class';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { PointDataService } from 'src/app/services/point-data.service';
import { IPointerCanvasPixel } from 'src/app/interfaces/pointer-canvas.interface';
import { SharedRatesDataService } from 'src/app/services/shared-rates-data.service';

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

  initialized = false; // If component is initialized.

  @ViewChild('pointer') pointer: ElementRef;

  pixelMatrix: IPointerCanvasPixel = {};

  constructor(private sharedData: SharedRatesDataService, private pointData: PointDataService) {}

  ngOnInit() {
    this.initialized = true;

    this.pointerCanvas.domElement = this.pointer.nativeElement as HTMLCanvasElement;

    this.sharedData.ratesMinSource.subscribe(min => this.pointerCanvas.minY = min);
    this.sharedData.ratesMaxSource.subscribe(max => this.pointerCanvas.maxY = max);

    this.pointData.eventSource.subscribe(e => this.drawPointer(e));
  }

  drawPointer(event: MouseEvent) {
    if (!event) {
      return;
    }
    const ctx = this.pointerCanvas.domElement.getContext('2d');
    ctx.clearRect(0, 0, this.pointerCanvas.width, this.pointerCanvas.height);
    const realCanvasWidth = this.pointerCanvas.width - this.pointerCanvas.right - this.pointerCanvas.left;
    const realCanvasHeight = this.pointerCanvas.height - this.pointerCanvas.top - this.pointerCanvas.bottom;
    const CanvasYAxisZero = this.pointerCanvas.top + realCanvasHeight;
    const CanvasYAxisMax = this.pointerCanvas.top;
    const x = event.offsetX;
    const y = event.offsetY;
    this.drawPointUnderCursor(ctx, x, y, CanvasYAxisZero);
    this.pointData.setPointData({
      x,
      y,
      pixelData: this.pixelMatrix[x]
    });
  }

  drawPointUnderCursor(ctx: CanvasRenderingContext2D, x: number, y: number, CanvasYAxisZero: number) {
    const matrixPoint = this.pixelMatrix[x];
    if (!matrixPoint) {
      return;
    }
    ctx.beginPath();
    ctx.setLineDash([4, 4]);
    ctx.moveTo(matrixPoint.x, matrixPoint.y);
    ctx.lineTo(matrixPoint.x, CanvasYAxisZero);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(matrixPoint.x, matrixPoint.y, 5, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#f6f7f8';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(matrixPoint.x, matrixPoint.y, 4, 0, 2 * Math.PI, true);
    ctx.fillStyle = '#74a3c7';
    ctx.fill();
  }

  /**
   * Calculate the matrix in accordance with the resolution
   * of pixels and the X-axis dots on the graph.
   */
  recalculatePixelMatrix() {
    const totalDays = this.rates.length;
    if (totalDays === 0) {
      return;
    }
    const realCanvasWidth = this.pointerCanvas.width - this.pointerCanvas.right - this.pointerCanvas.left;
    const realCanvasHeight = this.pointerCanvas.height - this.pointerCanvas.top - this.pointerCanvas.bottom;
    const diffOffset = (this.pointerCanvas.maxY - this.pointerCanvas.minY) * this.pointerCanvas.offsetY;
    const maxYVal = Math.round((this.pointerCanvas.maxY + diffOffset) * 100) / 100;
    const minYVal = Math.max(Math.round((this.pointerCanvas.minY - diffOffset) * 100) / 100, 0);
    const CanvasYAxisZero = this.pointerCanvas.top + realCanvasHeight;
    const CanvasYAxisMax = this.pointerCanvas.top;
    const axisXPart = realCanvasWidth / (totalDays - 1);
    const axisYPart = (CanvasYAxisZero - CanvasYAxisMax) / (maxYVal - minYVal);
    const diff = maxYVal - minYVal;

    const emptyPixelsAtCanvasLeft = this.pointerCanvas.left;
    for (let i = 0; i < emptyPixelsAtCanvasLeft; i++) {
      this.pixelMatrix[i] = null;
    }
    const maxCanvasChartZonePixel = emptyPixelsAtCanvasLeft + realCanvasWidth;

    let ratesIndex;
    for (let i = emptyPixelsAtCanvasLeft; i < maxCanvasChartZonePixel; i++) {
      ratesIndex = Math.round(((i - emptyPixelsAtCanvasLeft) / axisXPart));
      if (ratesIndex === -0) {
        ratesIndex = 0;
      }
      const valueAsNumber = this.rates[ratesIndex].value;
      this.pixelMatrix[i] = {
        x: Math.round(emptyPixelsAtCanvasLeft + ratesIndex * axisXPart),
        y: Math.round(this.pointerCanvas.top + (diff - (valueAsNumber - minYVal)) * axisYPart),
        value: this.rates[ratesIndex].value,
        date: this.rates[ratesIndex].date
      };
      this.pixelMatrix[i].previous = this.rates[ratesIndex - 1] ? this.rates[ratesIndex].value >= this.rates[ratesIndex - 1].value : null;
    }
    for (let i = maxCanvasChartZonePixel; i < this.pointerCanvas.width; i++) {
      this.pixelMatrix[i] = null;
    }
  }
}
