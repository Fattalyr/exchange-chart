import { createFeatureSelector, createSelector, MemoizedSelector } from '@ngrx/store';
import { ITimelineState } from './state';
import { ITimeline } from 'src/app/interfaces/timeline.interface';

export const selectState: MemoizedSelector<
  object,
  ITimelineState
  > = createFeatureSelector<ITimelineState>('timeline');

export const getLoading = (state: ITimelineState): boolean => state.isLoading;
export const selectTimelineIsLoading = createSelector(selectState, getLoading);

export const getTimeline = (state: ITimelineState): ITimeline => state.data;
export const selectTimeline = createSelector(selectState, getTimeline);

export const getError = (state: ITimelineState): string => state.error;
export const selectTimelineError = createSelector(selectState, getError);

