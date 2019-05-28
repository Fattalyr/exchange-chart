import { initialState, ITimelineState } from './state';
import { Actions, ActionTypes } from './actions';

export function timelineReducer(state = initialState, action: Actions): ITimelineState {
  switch (action.type) {
    case ActionTypes.PROCESS_DATA: {
      console.log('There are we doing processing of data.');
      return {
        ...state,
        data: action.payload
      };
    }
    case ActionTypes.PROCESS_ERROR: {
      console.log('Error of timeline processing.');
      return {
        ...state,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}
