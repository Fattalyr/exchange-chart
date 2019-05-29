import { initialState, ITimelineState } from './state';
import { Actions, ActionTypes } from './actions';

export function timelineReducer(state = initialState, action: Actions): ITimelineState {
  switch (action.type) {
    case ActionTypes.PROCESS_START: {
      return {
        ...state,
        isLoading: true
      };
    }
    case ActionTypes.PROCESS_SUCCESS: {
      return {
        ...state,
        data: action.payload,
        isLoading: false
      };
    }
    case ActionTypes.PROCESS_ERROR: {
      return {
        ...state,
        error: action.payload.error,
        isLoading: false
      };
    }
    default: {
      return state;
    }
  }
}
