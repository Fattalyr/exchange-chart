import { initialState, IRangeState } from './state';
import { Actions, ActionTypes } from './actions';

export function rangeReducer(state = initialState, action: Actions): IRangeState {
  switch (action.type) {
    case ActionTypes.CHANGE_RANGE: {
      console.log(action);
      return {
        ...state,
        startDate: action.payload.startDate,
        endDate: action.payload.endDate
      };
    }
    default: {
      return state;
    }
  }
}
