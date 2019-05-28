import { Action } from '@ngrx/store';
import { ITimeline } from '../../interfaces/timeline.interface';

export enum ActionTypes {
  PROCESS_DATA = '[TIMELINE] Process Data',
  PROCESS_ERROR = '[TIMELINE] Error'
}

export class ProcessDataAction implements Action {
  readonly type = ActionTypes.PROCESS_DATA;
  constructor(public payload: ITimeline) {}
}

export class ProcessErrorAction implements Action {
  readonly type = ActionTypes.PROCESS_ERROR;
  constructor(public payload: {error: string | null}) {}
}

export type Actions = ProcessDataAction | ProcessErrorAction;

