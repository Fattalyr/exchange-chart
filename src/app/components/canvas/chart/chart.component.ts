import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { CanvasLayer } from 'src/app/models/canvas-layer.class';
import * as moment from 'moment';
import { ITimeline } from 'src/app/interfaces/timeline.interface';

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

  initialized = false; // Индикатор, инициализирован ли компонент.

  @ViewChild('chart') chart: ElementRef;

  constructor() {}

  chartRedraw() {
    if (!this.timeline.length) {
      return;
    }
    const ctx = this.chartCanvas.domElement.getContext('2d');
    ctx.clearRect(0, 0, this.chartCanvas.width, this.chartCanvas.height);
    const realCanvasWidth = this.chartCanvas.width - this.chartCanvas.right - this.chartCanvas.left;
    const realCanvasHeight = this.chartCanvas.height - this.chartCanvas.top - this.chartCanvas.bottom;
    const CanvasYAxisZero = this.chartCanvas.top + realCanvasHeight;
    const CanvasYAxisMax = this.chartCanvas.top;
    let totalDays = 0; // дней на оси X
    let totalMonths = 0; // месяцев всего на оси X
    this.chartCanvas.minY = Infinity;
    this.chartCanvas.maxY = -Infinity;

    for (const year in this.timeline) {
      if (year === 'length') {
        continue;
      }
      totalMonths += +this.timeline[year].length;
      for (const month in this.timeline[year]) {
        if (month === 'length') {
          continue;
        }
        totalDays += +this.timeline[year][month].length;
        for (const day in this.timeline[year][month]) {
          if (day === 'length') {
            continue;
          }
          const rate = this.timeline[year][month][day].value;
          if (rate > this.chartCanvas.maxY) {
            this.chartCanvas.maxY = rate;
          }
          if (rate < this.chartCanvas.minY) {
            this.chartCanvas.minY = rate;
          }
        }
      }
      // Отступ 10% сверху и снизу.
      const diffOffset10 = (this.chartCanvas.maxY - this.chartCanvas.minY) * 0.1;
      this.chartCanvas.maxY = Math.round((this.chartCanvas.maxY + diffOffset10) * 100) / 100;
      this.chartCanvas.minY = Math.round((this.chartCanvas.minY - diffOffset10) * 100) / 100;
    }

    const axisXPart = Math.round((realCanvasWidth / totalDays) * 1000) / 1000;
    // console.log('Пикселей в делении: ', axisXPart);
    // console.log('Лет', totalYears);
    // console.log('Месяцев', totalMonths);
    // console.log('Дней', totalDays);

    this.drawLines(ctx, CanvasYAxisZero, CanvasYAxisMax, realCanvasWidth, realCanvasHeight);
    this.drawLabels(ctx, CanvasYAxisZero, CanvasYAxisMax, realCanvasWidth, realCanvasHeight, axisXPart);
    this.drawCurve(ctx, CanvasYAxisZero, CanvasYAxisMax, axisXPart);

  }

  /**
   * Рисует горизонтальные линии графика.
   * @param ctx - контекст.
   * @param CanvasYAxisZero - координата Y "нуля", т.е. откуда начинаем рисовать по высоте.
   * @param realCanvasWidth - реальная ширина холста, с вычетом отступов.
   * @param realCanvasHeight - реальная высота холста, с вычетом отступов.
   * @param CanvasYAxisMax - максимально высокая координата по Y.
   */
  // tslint:disable-next-line:max-line-length
  drawLines(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, realCanvasWidth: number, realCanvasHeight: number) {
    let linYVal; // Значение шкалы линии коридора по оси Y.
    let linY; // Линия коридора, значение будет меняться в ходе работы.
    const leftTextOffset = 32; // Смещение текста подписей линий влево.

    // Ось X
    ctx.beginPath();
    ctx.moveTo(this.chartCanvas.left, Math.round(CanvasYAxisZero));
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, Math.round(CanvasYAxisZero));
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    // Верхняя линия коридора
    ctx.beginPath();
    ctx.moveTo(this.chartCanvas.left, Math.round(CanvasYAxisMax));
    ctx.lineTo(this.chartCanvas.left + realCanvasWidth, Math.round(CanvasYAxisMax));
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#E5E7E9';
    ctx.lineCap = 'square';
    ctx.stroke();

    // Линия нижней трети
    ctx.beginPath();
    linYVal = Math.floor((this.chartCanvas.minY + (this.chartCanvas.maxY - this.chartCanvas.minY) * 0.3333) * 10) / 10;
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

    // Линия верхней трети
    ctx.beginPath();
    linYVal = Math.floor((this.chartCanvas.minY + (this.chartCanvas.maxY - this.chartCanvas.minY) * 0.6667) * 10) / 10;
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
    ctx.fillText(Math.floor(this.chartCanvas.maxY * 10) / 10 + '', this.chartCanvas.left - leftTextOffset, this.chartCanvas.top + 3);
    // tslint:disable-next-line:max-line-length
    ctx.fillText(Math.floor(this.chartCanvas.minY * 10) / 10 + '', this.chartCanvas.left - leftTextOffset, this.chartCanvas.top + realCanvasHeight + 3);
  }

  /**
   * Рисует подписи лет и месяцев.
   * @param ctx - контекст.
   * @param CanvasYAxisZero - координата Y "нуля", т.е. откуда начинаем рисовать по высоте.
   * @param realCanvasWidth - реальная ширина холста, с вычетом отступов.
   * @param realCanvasHeight - реальная высота холста, с вычетом отступов.
   * @param CanvasYAxisMax - максимально высокая координата по Y.
   * @param axisXPart - пикселей в одном дне на графике.
   */
  // tslint:disable-next-line:max-line-length
  drawLabels(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, realCanvasWidth: number, realCanvasHeight: number, axisXPart: number) {
    ctx.beginPath();
    const tl = this.timeline;
    let dayNumber = 0; // Номер дня от начала данных.
    let currentOffset = this.chartCanvas.left; // Смещение по оси X, по мере того, как сменяются дни.
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
          // Если начало года.
          if (tl[year][month][day].yearStart) {
            this.drawYearLabel(ctx, currentOffset, CanvasYAxisZero, year, month, axisXPart);
          }
          // Если начало месяца.
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
   * Устанавливает стиль надписей по умолчанию.
   * @param ctx - контекст.
   */
  defaultCanvasText(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.font = 'normal 12px Calibri';
    ctx.fillStyle = '#99a0a8';
    ctx.textAlign = 'left';
  }

  /**
   * Устанавливает стиль кривой по умолчанию.
   * @param ctx - контекст.
   */
  defaultCurveLineStyle(ctx: CanvasRenderingContext2D) {
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#74A3C7';
    ctx.lineCap = 'round';
    ctx.stroke();
  }

  /**
   * Рисует метку года.
   * @param ctx - контекст.
   * @param currentOffset - текущее смещение по оси X.
   * @param CanvasYAxisZero - координаты нуля по оси Y.
   * @param year - отрисовываемый год.
   * @param month - чтобы проверить, если год начинается с декабря.
   * @param axisXPart - сколько пикселей в "дне" по оси X.
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
   * Отрисовывает название месяца.
   * @param ctx - контекст.
   * @param currentOffset - текущее смещение по оси X.
   * @param CanvasYAxisZero - координаты нуля по оси Y.
   * @param year - год.
   * @param month - месяц.
   * @param day - день.
   * @param axisXPart - сколько пикселей в "дне" по оси X.
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

  drawCurve(ctx: CanvasRenderingContext2D, CanvasYAxisZero: number, CanvasYAxisMax: number, axisXPart: number) {
    ctx.beginPath();
    this.defaultCurveLineStyle(ctx);
    const tl = this.timeline;
    let prevX = this.chartCanvas.left;
    let prevY = 0;
    const maxYVal = this.chartCanvas.maxY;
    const minYVal = this.chartCanvas.minY;
    const diff = maxYVal - minYVal;
    const axisYPart = (CanvasYAxisZero - CanvasYAxisMax) / (maxYVal - minYVal);

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
            prevX += axisXPart;
            continue;
          }
          this.defaultCurveLineStyle(ctx);
          const Y = Math.round(this.chartCanvas.top + (diff - (tl[year][month][day].value - minYVal)) * axisYPart);
          ctx.moveTo(prevX, prevY);
          ctx.lineTo(prevX + axisXPart, Y);
          prevX = Math.round(prevX + axisXPart);
          prevY = Y;
        }
      }
    }
  }

  ngOnInit() {
    this.chartCanvas.domElement = this.chart.nativeElement as HTMLCanvasElement;
    this.initialized = true;
    this.chartRedraw();
  }
}
