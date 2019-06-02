import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../constants/currencies';
import { exchangeCurrency } from '../data/actions/balanceActions';
import { IAppState, IBalancesState } from '../data/reducers/rootState';
import App from './App';

interface IAppStateProps {
  balances: IBalancesState;
}
interface IAppDispatchProps {
  exchangeCurrency(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
}

type MapStateFunc = (state: IAppState) => IAppStateProps;
const mapState: MapStateFunc = (state) => ({
  balances: state.balances,
});

type MapDispatchFunc = (dispatch: Dispatch) => IAppDispatchProps;
const mapDispatch: MapDispatchFunc = (dispatch) => bindActionCreators({
  exchangeCurrency,
}, dispatch);

export default connect(mapState, mapDispatch)(App);
