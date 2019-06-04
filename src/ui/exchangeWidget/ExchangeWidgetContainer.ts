import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../../constants/currencies';
import { fetchRatesForCurrency } from '../../data/actions/rateActions';
import { IAppState, IBalancesState, IRatesState } from '../../data/reducers/rootState';
import ExchangeWidgetController from './ExchangeWidgetController';

interface IExchangeWidgetControllerOwnProps {
  backgroundColor: string;
  className?: string;
  balances: IBalancesState;
  currencies: Currency[];
  fetchTimeout?: number;

  onExchange(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
}
interface IExchangeWidgetControllerStateProps {
  rates: IRatesState;
}
interface IExchangeWidgetControllerDispatchProps {
  fetchRatesForCurrency(currency: Currency): void;
}

type MapStateFunc = (state: IAppState, ownProps: IExchangeWidgetControllerOwnProps) =>
  IExchangeWidgetControllerStateProps;
const mapState: MapStateFunc = (state) => ({
  rates: state.rates,
});

type MapDispatchFunc = (dispatch: Dispatch, ownProps: IExchangeWidgetControllerOwnProps) =>
  IExchangeWidgetControllerDispatchProps;
const mapDispatch: MapDispatchFunc = (dispatch) => bindActionCreators({
  fetchRatesForCurrency,
}, dispatch);

export default connect(mapState, mapDispatch)(ExchangeWidgetController);
