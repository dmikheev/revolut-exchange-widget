import { combineReducers } from 'redux';
import balances from './balancesReducer';
import rates from './ratesReducer';
import { IAppState } from './rootState';

export default combineReducers<IAppState>({
  balances,
  rates,
});
