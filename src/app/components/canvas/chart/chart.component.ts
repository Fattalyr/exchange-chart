import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  ChangeDetectionStrategy,
  Input
} from '@angular/core';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { CanvasLayer } from 'src/app/models/canvas-layer.class';
import * as moment from 'moment';
import { ITimeline } from '../../../interfaces/timeline.interface';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartComponent implements OnInit {
  _rates: IJSONPoint[];
  @Input('rates')
  set rates(val: IJSONPoint[]) {
    this._rates = val;
    if (this.initialized) {
      this.initChartRedraw();
    }
  }
  get rates(): IJSONPoint[] {
    return this._rates;
  }

  chartCanvas: CanvasLayer = new CanvasLayer({idSelector: 'chart'});

  initialized = false; // Индикатор, инициализирован ли компонент.

  @ViewChild('chart') chart: ElementRef;

  constructor() {}

  initChartRedraw() {
    const len = this.rates.length;
    const ctx = this.chartCanvas.domElement.getContext('2d');
    this.calculateYears();
    this.calculateMonths();
  }

  /**
   * Рассчитываем количество лет, заполняем
   * ими массив в объекте this.chartCanvas.
   */
  calculateYears(): void {
    if (!this.rates[0]) {
      return;
    }
    const len = this.rates.length;
    const firstYear = +moment(this.rates[0].date, 'DD.MM.YYYY').format('YYYY');
    const lastYear = +moment(this.rates[len - 1].date, 'DD.MM.YYYY').format('YYYY');
    const diff = lastYear - firstYear;
    for (let i = 0; i <= diff; i++ ) {
      this.chartCanvas.axisXYears.push(firstYear + i);
    }
    console.log(this.chartCanvas.axisXYears);
  }

  /**
   * Рассчитываем количество месяцев, заполняем
   * ими массив в объекте this.chartCanvas.
   */
  calculateMonths(): void {
    if (!this.rates[0]) {
      return;
    }

  }

  ngOnInit() {
    this.chartCanvas.domElement = this.chart.nativeElement as HTMLCanvasElement;
    this.initialized = true;
    this.initChartRedraw();
  }
}
