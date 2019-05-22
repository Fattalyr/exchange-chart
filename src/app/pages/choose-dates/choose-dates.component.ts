import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { DateAdapter } from '@angular/material';
import { MyDateAdapter } from './custom-date-adapter';
import { StoreState, RangeActions } from '../../store';
import * as moment from 'moment';

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
  ) {
    console.log(this.transformDate(this.endDate.value));
  }

  ngOnInit() {
    setTimeout(() => {
      this.store.dispatch(
        new RangeActions.ChangeRangeAction({
          startDate: this.transformDate(this.startDate.value),
          endDate: this.transformDate(this.endDate.value)
        })
      );
    });
  }

  generateStartDate(): Date {
    const now = new Date();
    const thisYear = now.getFullYear();
    return new Date(`January 1, ${thisYear} 00:00:00`);
  }

  transformDate(date: string): string {
    return moment(date).format('DD/MM/YYYY');
  }
}
