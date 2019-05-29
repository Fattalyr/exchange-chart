import { initialState, ITimelineState } from './state';
import { Actions, ActionTypes } from './actions';

export function timelineReducer(state = initialState, action: Actions): ITimelineState {
  switch (action.type) {
    case ActionTypes.PROCESS_DATA: {
      console.log('Process data reducer');
      return {
        ...state,
        data: action.payload
      };
    }
    case ActionTypes.PROCESS_ERROR: {
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
