import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { IRangeState } from './state';

export const selectState: MemoizedSelector<
  object,
  IRangeState
  > = createFeatureSelector<IRangeState>('range');

export const getStartDate = (state: IRangeState): string => state.startDate;
export const getEndDate = (state: IRangeState): string => state.endDate;
export const getRange = (state: IRangeState): IRangeState => state;
export const selectStartDate = createSelector(selectState, getStartDate);
export const selectEndDate = createSelector(selectState, getEndDate);
export const selectRange = createSelector(selectState, getRange);

