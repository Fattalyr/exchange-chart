import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import * as RootStoreState from '../store/state';
import { RangeActions } from '../store';

@Injectable({
  providedIn: 'root'
})
export class RangeService {
  constructor(private store: Store<RootStoreState.State>) {}

  callForDateWithNewRange(startDate: string, endDate: string) {
    this.store
      .dispatch(new RangeActions.ChangeRangeAction({startDate, endDate}));
  }
}
