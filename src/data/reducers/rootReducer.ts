import { combineReducers } from 'redux';
import balances from './balancesReducer';
import rates from './ratesReducer';
import { IRootState } from './rootState';

export default combineReducers<IRootState>({
  balances,
  rates,
});
