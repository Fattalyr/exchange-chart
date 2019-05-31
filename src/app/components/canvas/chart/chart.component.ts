import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { CanvasLayer } from 'src/app/models/canvas-layer.class';
import { ITimeline } from 'src/app/interfaces/timeline.interface';
import { SharedRatesDataService } from 'src/app/services/shared-rates-data.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {
  _timeline: ITimeline;
  @Input('timeline')
  set timeline(val: ITimeline) {
    this._timeline = val;
    if (this.initialized) {
      this.chartRedraw();
    }
  }
  get timeline(): ITimeline {
    return this._timeline;
  }

  chartCanvas: CanvasLayer = new CanvasLayer({idSelector: 'chart'});

  initialized = false; // If component is initialized.

  @ViewChild('chart') chart: ElementRef;

  totalDays: number;

  constructor(private sharedData: SharedRatesDataService) {}

  chartRedraw() {
    if (!this.timeline.length) {
      return;
    }
    // tslint:disable-next-line:no-console
    console.time('Time of the chart redrawing');
    const ctx = this.chartCanvas.domElement.getContext('2d');
    ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
    const realCanvasWidth = this.chartCanvas.width - this.chartCanvas.right - this.chartCanvas.left;
    const realCanvasHeight = this.chartCanvas.height - this.chartCanvas.top - this.chartCanvas.bottom;
    const CanvasYAxisZero = this.chartCanvas.top + realCanvasHeight;
    const CanvasYAxisMax = this.chartCanvas.top;
    const diffOffset = (this.chartCanvas.maxY - this.chartCanvas.minY) * this.chartCanvas.offsetY;
    const maxYVal = Math.round((this.chartCanvas.maxY + diffOffset) * 100) / 100;
    const minYVal = Math.max(Math.round((this.chartCanvas.minY - diffOffset) * 100) / 100, 0);
    const axisXPart = realCanvasWidth / (this.totalDays - 1);

    this.drawLines(ctx, CanvasYAxisZero, CanvasYAxisMax, realCanvasWidth, realCanvasHeight, maxYVal, minYVal);
    this.drawLabels(ctx, CanvasYAxisZero, CanvasYAxisMax, realCanvasWidth, realCanvasHeight, axisXPart);
    this.drawCurve(ctx, CanvasYAxisZero, CanvasYAxisMax, axisXPart, maxYVal, minYVal);
    // tslint:disable-next-line:no-console
    console.timeEnd('Time of the chart redrawing');
  }

  /**
   * Draw horizontal lines of the chart.
   * @param ctx - 2D context of canvas.
   * @param CanvasYAxisZero - "zero" Y coordinate, i.e. it's where we start to draw from.
   * @param realCanvasWidth - real canvas width without offsets.
   * @param realCanvasHeight - real canvas height without offsets.
   * @param CanvasYAxisMax - maximum coordinate for Y axis.
   * @param maxYVal - maximum cost value for Y axis of the chart.
   * @param minYVal - minimum cost value for Y axis of the chart.
   */
  // tslint:disable-next-line:max-line-length
  drawLines(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, realCanvasWidth: number, realCanvasHeight: number, maxYVal: number, minYVal: number) {
    let linYVal; // Value of corridor line.
    let linY; // Currency corridor line coordinate.
    const leftTextOffset = 32; // Text offset to the left.

    // Axis X
    ctx.beginPath();
    ctx.moveTo(this.chartCanvas.left, Math.round(CanvasYAxisZero));
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, Math.round(CanvasYAxisZero));
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    // Top line of currency corridor
    ctx.beginPath();
    ctx.moveTo(this.chartCanvas.left, Math.round(CanvasYAxisMax));
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, Math.round(CanvasYAxisMax));
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    // Bottom third line
    ctx.beginPath();
    linYVal = Math.floor((minYVal + (maxYVal - minYVal) * 0.3333) * 10) / 10;
    linY = Math.round(this.chartCanvas.top + (realCanvasHeight * 0.6667));
    ctx.moveTo(this.chartCanvas.left, linY);
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, linY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    ctx.font = 'normal 12px Calibri';
    ctx.fillStyle = '#99a0a8';
    ctx.fillText(linYVal + '', this.chartCanvas.left - leftTextOffset, linY + 3);

    // Line two-thirds
    ctx.beginPath();
    linYVal = Math.floor((minYVal + (maxYVal - minYVal) * 0.6667) * 10) / 10;
    linY = Math.round(this.chartCanvas.top + (realCanvasHeight * 0.3333));
    ctx.moveTo(this.chartCanvas.left, linY);
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, linY);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    ctx.font = 'normal 12px Calibri';
    ctx.fillStyle = '#99a0a8';
    ctx.fillText(linYVal + '', this.chartCanvas.left - leftTextOffset, linY + 3);

    ctx.font = 'normal 12px Calibri';
    ctx.fillStyle = '#99a0a8';
    ctx.fillText(Math.floor(maxYVal * 10) / 10 + '', this.chartCanvas.left - leftTextOffset, this.chartCanvas.top + 3);
    // tslint:disable-next-line:max-line-length
    ctx.fillText(Math.floor(minYVal * 10) / 10 + '', this.chartCanvas.left - leftTextOffset, this.chartCanvas.top + realCanvasHeight + 3);
  }

  /**
   * Draw months and years labels.
   * @param ctx - 2D context of canvas.
   * @param CanvasYAxisZero - "zero" Y coordinate, i.e. it's where we start to draw from.
   * @param realCanvasWidth - real canvas width without offsets.
   * @param realCanvasHeight - real canvas height without offsets.
   * @param CanvasYAxisMax - maximum coordinate for Y axis.
   * @param axisXPart - pixels per one day on X axis.
   */
  // tslint:disable-next-line:max-line-length
  drawLabels(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, realCanvasWidth: number, realCanvasHeight: number, axisXPart: number) {
    ctx.beginPath();
    const tl = this.timeline;
    let dayNumber = 0; // Number of current day.
    let currentOffset = this.chartCanvas.left; // X offset in pixels.
    for (const year in tl) {
      if (year === 'length') {
        continue;
      }
      for (const month in tl[year]) {
        if (month === 'length') {
          continue;
        }
        for (const day in tl[year][month]) {
          if (day === 'length') {
            continue;
          }
          // If year just has been started.
          if (tl[year][month][day].yearStart) {
            this.drawYearLabel(ctx, currentOffset, CanvasYAxisZero, year, month, axisXPart);
          }
          // If month just has been started.
          if (tl[year][month][day].monthStart) {
            this.drawMonthLabel(ctx, currentOffset, CanvasYAxisZero, year, month, day, axisXPart);
          }
          dayNumber++;
          currentOffset = this.chartCanvas.left + dayNumber * axisXPart;
        }
      }
    }
  }

  /**
   * Define the label style by default.
   * @param ctx - 2D context of canvas.
   */
  defaultCanvasText(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.font = 'normal 12px Calibri';
    ctx.fillStyle = '#99a0a8';
    ctx.textAlign = 'left';
  }

  /**
   * Define the curve style by default.
   * @param ctx - 2D context of canvas.
   */
  defaultCurveLineStyle(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#74A3C7';
    ctx.lineCap = 'round';
  }

  /**
   * Draw year label.
   * @param ctx - 2D context of canvas.
   * @param currentOffset - current X-offset.
   * @param CanvasYAxisZero - "zero" Y coordinate, i.e. it's where we start to draw from.
   * @param year - drawing year.
   * @param month - it's for check if year started from December.
   * @param axisXPart - pixels per one day on X axis.
   */
  // tslint:disable-next-line:max-line-length
  drawYearLabel(ctx: CanvasRenderingContext2D, currentOffset: number, CanvasYAxisZero: number, year: string, month: string, axisXPart: number) {
    ctx.beginPath();
    ctx.moveTo(currentOffset, CanvasYAxisZero);
    ctx.lineTo(currentOffset, CanvasYAxisZero + 30);
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();
    this.defaultCanvasText(ctx);
    const monthLength = axisXPart * this.timeline[year][month].length; // Сколько пикселей приходится на декабрь.
    if (month !== '11') {
      ctx.fillText(year + ' →', currentOffset + 12, CanvasYAxisZero + 28);
    } else {
      if (monthLength >= 26) {
        ctx.fillText('\'' + year.substr(-2), currentOffset + 8, CanvasYAxisZero + 28);
      }
    }
  }

  /**
   * Draw month label.
   * @param ctx - 2D context of canvas.
   * @param currentOffset - current X-offset.
   * @param CanvasYAxisZero - "zero" Y coordinate, i.e. it's where we start to draw from.
   * @param year - year.
   * @param month - month.
   * @param day - day.
   * @param axisXPart - pixels per one day on X axis.
   */
  // tslint:disable-next-line:max-line-length
  drawMonthLabel(ctx: CanvasRenderingContext2D, currentOffset: number, CanvasYAxisZero: number, year: number | string, month: number | string, day: number | string, axisXPart: number) {
    ctx.beginPath();
    this.defaultCanvasText(ctx);
    let monthName: string;
    const wordLength = axisXPart * this.timeline[year][month].length;
    if (wordLength > 40) {
      monthName = new Date(+year, +month, +day).toLocaleString('ru', {
        month: 'long'
      });
      this.defaultCanvasText(ctx);
      ctx.fillText(monthName, currentOffset + 12, CanvasYAxisZero + 14);
    } else if (wordLength > 25 && wordLength <= 40) {
      monthName = new Date(+year, +month, +day).toLocaleString('ru', {
        month: 'short'
      });
      this.defaultCanvasText(ctx);
      ctx.fillText(monthName, currentOffset + 8, CanvasYAxisZero + 14);
    } else if (wordLength > 14 && wordLength <= 25) {
      monthName = new Date(+year, +month, +day).toLocaleString('ru', {
        month: 'narrow'
      }).toLowerCase();
      this.defaultCanvasText(ctx);
      ctx.fillText(monthName, currentOffset + 4, CanvasYAxisZero + 14);
    }
  }

  /**
   * Draw the curve.
   * @param ctx - 2D context of canvas.
   * @param CanvasYAxisZero - "zero" Y coordinate, i.e. it's where we start to draw from.
   * @param CanvasYAxisMax - maximum coordinate for Y axis.
   * @param axisXPart - pixels per one day on X axis.
   * @param maxYVal - maximum cost value for Y axis of the chart.
   * @param minYVal - minimum cost value for Y axis of the chart.
   */
  // tslint:disable-next-line:max-line-length
  drawCurve(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, axisXPart: number, maxYVal: number, minYVal: number) {
    ctx.beginPath();
    this.defaultCurveLineStyle(ctx);
    const tl = this.timeline;
    let prevX = this.chartCanvas.left;
    let prevY = 0;
    const diff = maxYVal - minYVal;
    const axisYPart = (CanvasYAxisZero - CanvasYAxisMax) / diff;

    for (const year in tl) {
      if (year === 'length') {
        continue;
      }
      for (const month in tl[year]) {
        if (month === 'length') {
          continue;
        }
        for (const day in tl[year][month]) {
          if (day === 'length') {
            continue;
          }
          if (prevY === 0) {
            prevY = this.chartCanvas.top + (diff - (tl[year][month][day].value - minYVal)) * axisYPart;
            continue;
          }
          const Y = Math.round(this.chartCanvas.top + (diff - (tl[year][month][day].value - minYVal)) * axisYPart);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(prevX + axisXPart, Y);
          prevX = prevX + axisXPart;
          prevY = Y;
        }
      }
    }
    ctx.stroke();
  }

  ngOnInit() {
    this.chartCanvas.domElement = this.chart.nativeElement as HTMLCanvasElement;
    this.sharedData.ratesLengthSource.subscribe(length => this.totalDays = length);
    this.sharedData.ratesMinSource.subscribe(min => this.chartCanvas.minY = min);
    this.sharedData.ratesMaxSource.subscribe(max => this.chartCanvas.maxY = max);
    this.initialized = true;
  }
}
