import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DateAdapter } from '@angular/material';
import { MyDateAdapter } from './custom-date-adapter';
import { StoreState, RangeActions } from '../../store';
import * as moment from 'moment';
import { RatesActions } from '../../store/rates';

@Component({
  selector: 'app-choose-dates',
  templateUrl: './choose-dates.component.html',
  styleUrls: ['./choose-dates.component.scss'],
  providers: [
    {provide: DateAdapter, useClass: MyDateAdapter}
  ],
})
export class ChooseDatesComponent implements OnInit {
  startDate = new FormControl(this.generateStartDate());
  endDate = new FormControl(new Date());

  constructor(
    private store: Store<StoreState.State>
  ) { }

  ngOnInit() {
    this.rangeChange();
  }

  generateStartDate(): Date {
    const now = new Date();
    const thisYear = now.getFullYear();
    return new Date(`January 1, ${thisYear} 00:00:00`);
  }

  transformDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }

  /**
   * Обновляет диапазон в хранилище.
   * Реагирует на изменения даты и запрашивает с сервера ЦБР
   * новый диапазон котировок.
   */
  rangeChange(): void {
    const startDate = this.transformDate(this.startDate.value);
    const endDate = this.transformDate(this.endDate.value);

    this.store.dispatch(
      new RangeActions.ChangeRangeAction({
        startDate: startDate,
        endDate: endDate
      })
    );

    this.store.dispatch(
      new RatesActions.LoadRequestAction({
        startDate: startDate,
        endDate: endDate
      })
    );
  }

  picker1Filter = (d: Date): boolean => {
    const checkingDate = moment(d);
    const minimumDate = moment('11-04-1997');
    const today = moment();
    return !(checkingDate.isBefore(minimumDate) || checkingDate.isAfter(today));
  }

  picker2Filter = (d: Date): boolean => {
    const startDate = moment(this.startDate.value);
    const checkingDate = moment(d);
    const minimumDate = moment('11-04-1997');
    const today = moment();
    return !(checkingDate.isBefore(minimumDate) || checkingDate.isAfter(today) || checkingDate.isBefore(startDate));
  }

  checkForOverdating(): void {
    const startDate = moment(this.startDate.value);
    const endDate = moment(this.endDate.value);
    const today = moment();
    if (startDate.isSame(today)) {
      this.endDate.setValue(new Date());
      return;
    }
    if (startDate.isAfter(endDate)) {
      this.endDate.setValue(startDate.toDate());
      return;
    }
  }
}
