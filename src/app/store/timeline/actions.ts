import { Action } from '@ngrx/store';
import { ITimeline } from '../../interfaces/timeline.interface';

export enum ActionTypes {
  PROCESS_START = '[TIMELINE] Process Start',
  PROCESS_SUCCESS = '[TIMELINE] Process Success',
  PROCESS_ERROR = '[TIMELINE] Error'
}

export class ProcessStartAction implements Action {
  readonly type = ActionTypes.PROCESS_START;
  constructor() {}
}

export class ProcessSuccessAction implements Action {
  readonly type = ActionTypes.PROCESS_SUCCESS;
  constructor(public payload: ITimeline) {}
}

export class ProcessErrorAction implements Action {
  readonly type = ActionTypes.PROCESS_ERROR;
  constructor(public payload: {error: string | null}) {}
}

export type Actions = ProcessStartAction | ProcessSuccessAction | ProcessErrorAction;

