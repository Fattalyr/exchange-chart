import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IRatesState } from './state';
import { IJSONPoint } from 'src/app/interfaces/xml.interface';

export const selectState: MemoizedSelector<
  object,
  IRatesState
  > = createFeatureSelector<IRatesState>('rates');

export const getIsLoading = (state: IRatesState): boolean => state.isLoading;
export const selectRatesAreLoading = createSelector(selectState, getIsLoading);

export const getAllRates = (state: IRatesState): IJSONPoint[] => state.rates;
export const selectAllRates = createSelector(selectState, getAllRates);

export const getError = (state: IRatesState): any => state.error;
export const selectRatesError = createSelector(selectState, getError);
