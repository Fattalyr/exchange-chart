import { Action } from '@ngrx/store';
import { IRangeState } from './state';

export enum ActionTypes {
  CHANGE_RANGE = '[RANGE] Change dates'
}

export class ChangeRangeAction implements Action {
  readonly type = ActionTypes.CHANGE_RANGE;
  constructor(public payload: IRangeState) {}
}

export type Actions = ChangeRangeAction;

