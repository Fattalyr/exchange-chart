import { ITimeline } from '../../interfaces/timeline.interface';

export interface ITimelineState {
  data: ITimeline | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: ITimelineState = {
  data: null,
  isLoading: false,
  error: null
};
