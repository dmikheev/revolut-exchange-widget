import { IAppAction } from '../actions/IAppAction';
import { RateActionType } from '../actions/rateActions';
import { IRatesState } from './rootState';

export default function ratesReducer(state: IRatesState = {}, action: IAppAction): IRatesState {
  switch (action.type) {
    case RateActionType.FETCH_RATES_REQUEST: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: true,
        },
      };
    }

    case RateActionType.FETCH_RATES_RESPONSE_SUCCESS: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: false,
          isLoaded: true,
          rates: action.data.response.rates,
        },
      };
    }

    case RateActionType.FETCH_RATES_RESPONSE_ERROR: {
      const currencyState = state[action.data.currency];

      return {
        ...state,
        [action.data.currency]: {
          ...currencyState,
          isFetching: false,
        },
      };
    }

    default:
      return state;
  }
}
