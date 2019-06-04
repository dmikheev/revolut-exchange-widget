import { IAppAction } from '../actions/IAppAction';
import { RateActionType } from '../actions/rateActions';
import { IRatesState } from './rootState';

export default function ratesReducer(state: IRatesState = {}, action: IAppAction): IRatesState {
  switch (action.type) {
    case RateActionType.FETCH_RATES_REQUEST: {
      const pairState = state[action.data.pair];

      return {
        ...state,
        [action.data.pair]: {
          ...pairState,
          isFetching: true,
        },
      };
    }

    case RateActionType.FETCH_RATES_RESPONSE_SUCCESS: {
      const pairState = state[action.data.pair];

      return {
        ...state,
        [action.data.pair]: {
          ...pairState,
          data: action.data.response,
          isFetching: false,
          isLoaded: true,
        },
      };
    }

    case RateActionType.FETCH_RATES_RESPONSE_ERROR: {
      const pairState = state[action.data.pair];

      return {
        ...state,
        [action.data.pair]: {
          ...pairState,
          isFetching: false,
        },
      };
    }

    default:
      return state;
  }
}
