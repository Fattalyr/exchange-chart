import { RatesState } from './rates';
import { RangeState } from './range';

export interface State {
  ratesData: RatesState.IRatesState;
  rangeData: RangeState.IRangeState;
}
