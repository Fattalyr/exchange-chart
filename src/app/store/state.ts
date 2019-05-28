import { RatesState } from './rates';
import { RangeState } from './range';
import { TimelineState } from './timeline';

export interface State {
  ratesData: RatesState.IRatesState;
  rangeData: RangeState.IRangeState;
  timeline: TimelineState.ITimelineState;
}
