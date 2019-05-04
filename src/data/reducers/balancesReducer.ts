import { BalanceActionType } from '../actions/balanceActions';
import { IAppAction } from '../actions/IAppAction';
import { IBalancesState } from './rootState';

export default function balancesReducer(
  state: IBalancesState = {},
  action: IAppAction,
): IBalancesState {
  switch (action.type) {
    case BalanceActionType.EXCHANGE_CURRENCY:
      return {
        ...state,
        [action.data.currencyFrom]: (state[action.data.currencyFrom] || 0) - action.data.amountFrom,
        [action.data.currencyTo]: (state[action.data.currencyTo] || 0) + action.data.amountTo,
      };

    default:
      return state;
  }
}
