import { createSelector, MemoizedSelector } from '@ngrx/store';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { ITimeline } from 'src/app/interfaces/timeline.interface';
import { RatesSelectors } from './rates';
import { TimelineSelectors } from './timeline';

export const selectRatesError = createSelector(
  RatesSelectors.selectRatesError,
  (error: any) => {
    return error;
  }
);

export const selectRatesAreLoading = createSelector(
  RatesSelectors.selectRatesAreLoading,
  (loading: boolean) => {
    return loading;
  }
);

export const selectAllRates = createSelector(
  RatesSelectors.selectAllRates,
  (rates: IJSONPoint[]) => {
    return rates;
  }
);

export const selectTimelineIsLoading = createSelector(
  TimelineSelectors.selectTimelineIsLoading,
  (loading: boolean) => {
    return loading;
  }
);

export const selectTimeline = createSelector(
  TimelineSelectors.selectTimeline,
  (data: ITimeline) => {
    return data;
  }
);

export const selectTimelineError = createSelector(
  TimelineSelectors.selectTimelineError,
  (error: string | null) => {
    return error;
  }
);
