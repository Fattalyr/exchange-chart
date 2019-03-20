import { initialState, IRatesState } from './state';
import { Actions, ActionTypes } from './actions';

export function ratesReducer(state = initialState, action: Actions): IRatesState {
  switch (action.type) {
    case ActionTypes.LOAD_REQUEST: {
      return {
        ...state,
        isLoading: true,
        error: null
      };
    }
    case ActionTypes.LOAD_SUCCESS: {
      return {
        ...state,
        RATES: action.payload.items.Record,
        isLoading: false,
        error: null
      };
    }
    case ActionTypes.LOAD_FAILURE: {
      return {
        ...state,
        isLoading: false,
        error: action.payload.error
      };
    }
    default: {
      return state;
    }
  }
}
