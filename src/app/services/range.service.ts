import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RootStoreState from '../store/state';
import { ChangeRangeAction } from '../store/range/actions';

@Injectable({
  providedIn: 'root'
})
export class RangeService {
  constructor(private store: Store<RootStoreState.State>) {}

  callForDateWithNewRange(startDate: string, endDate: string) {
    this.store
      .dispatch(new ChangeRangeAction({startDate, endDate}));
  }
}
