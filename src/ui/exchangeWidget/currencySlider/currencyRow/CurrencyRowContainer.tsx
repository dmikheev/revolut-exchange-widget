import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../../../../constants/currencies';
import { fetchRatesForCurrency } from '../../../../data/actions/rateActions';
import { ICurrencyData, IRootState } from '../../../../data/reducers/rootState';
import CurrencyRow from './CurrencyRow';

const UPDATE_RATES_INTERVAL = 10000;

interface ICurrencyRowContainerOwnProps {
  className?: string;
  balance: number;
  currency: Currency;
  sourceCurrency: Currency;
  isSourceCurrency?: boolean;
}
interface ICurrencyRowContainerStateProps {
  currencyData?: ICurrencyData;
}
interface ICurrencyRowContainerDispatchProps {
  fetchRatesForCurrency(currency: Currency): void;
}

type ICurrencyRowContainerProps =
  ICurrencyRowContainerOwnProps
  & ICurrencyRowContainerStateProps
  & ICurrencyRowContainerDispatchProps;
class CurrencyRowContainer extends React.PureComponent<ICurrencyRowContainerProps> {
  private updateRatesTimeoutId: number | null = null;

  public componentDidMount(): void {
    this.fetchRatesAndSetTimeout();
  }

  public componentDidUpdate(prevProps: ICurrencyRowContainerProps): void {
    const { currency } = this.props;

    if (currency !== prevProps.currency) {
      this.fetchRatesAndSetTimeout();
    }
  }

  public render() {
    return (
      <CurrencyRow {...this.props}/>
    );
  }

  public componentWillUnmount(): void {
    this.clearTimeout();
  }

  private fetchRatesAndSetTimeout(): void {
    const {
      currency,
      fetchRatesForCurrency: fetchRatesForCurrencyProp,
      isSourceCurrency,
    } = this.props;

    if (isSourceCurrency) {
      return;
    }

    this.clearTimeout();

    fetchRatesForCurrencyProp(currency);
    // TS берёт тип из NodeJS.setTimeout, который возвращает Timeout вместо number,
    // поэтому приведём вручную к number
    this.updateRatesTimeoutId = setTimeout(() => {
      this.fetchRatesAndSetTimeout();
    }, UPDATE_RATES_INTERVAL) as unknown as number;
  }

  private clearTimeout(): void {
    if (this.updateRatesTimeoutId !== null) {
      clearTimeout(this.updateRatesTimeoutId);
    }
  }
}

type MapStateFunc =
  (state: IRootState, ownProps: ICurrencyRowContainerOwnProps) => ICurrencyRowContainerStateProps;
const mapState: MapStateFunc = (state, ownProps) => ({
  currencyData: state.rates[ownProps.currency],
});

type MapDispatchFunc = (dispatch: Dispatch, ownProps: ICurrencyRowContainerOwnProps) =>
  ICurrencyRowContainerDispatchProps;
const mapDispatch: MapDispatchFunc = (dispatch) => bindActionCreators({
  fetchRatesForCurrency,
}, dispatch);

export default connect(mapState, mapDispatch)(CurrencyRowContainer);
