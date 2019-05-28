import { ITimeline } from '../../interfaces/timeline.interface';

export interface ITimelineState {
  data: ITimeline | null;
  error: string | null;
}

export const initialState: ITimelineState = {
  data: null,
  error: null
};
