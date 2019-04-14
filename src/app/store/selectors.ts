import { createSelector, MemoizedSelector } from '@ngrx/store';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';
import { RatesSelectors } from './rates';

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
