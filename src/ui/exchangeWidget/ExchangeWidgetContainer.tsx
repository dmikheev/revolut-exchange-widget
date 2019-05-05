import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../../constants/currencies';
import { fetchRatesForCurrency } from '../../data/actions/rateActions';
import { IBalancesState, IRatesState, IRootState } from '../../data/reducers/rootState';
import { cashFormat } from '../../utils/cashFormat';
import { isCashStringValid } from '../../utils/isCashStringValid';
import ExchangeWidget from './ExchangeWidget';

const UPDATE_RATES_INTERVAL = 10000;

interface IExchangeWidgetContainerOwnProps {
  backgroundColor: string;
  className?: string;
  balances: IBalancesState;
  currencies: Currency[];

  onExchange(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
}
interface IExchangeWidgetContainerStateProps {
  rates: IRatesState;
}
interface IExchangeWidgetContainerDispatchProps {
  fetchRatesForCurrency(currency: Currency): void;
}
type IExchangeWidgetContainerProps =
  IExchangeWidgetContainerOwnProps
  & IExchangeWidgetContainerStateProps
  & IExchangeWidgetContainerDispatchProps;

interface IExchangeWidgetContainerState {
  amountFromStr: string;
  amountToStr: string;
  currencyFrom: Currency;
  currencyTo: Currency;
}

class ExchangeWidgetContainer
  extends React.PureComponent<IExchangeWidgetContainerProps, IExchangeWidgetContainerState> {

  private updateRatesTimeoutId: number | null = null;

  constructor(props: IExchangeWidgetContainerProps) {
    super(props);

    const { currencies } = props;

    const currencyFrom = currencies[0] || Currency.USD;

    this.state = {
      amountFromStr: '',
      amountToStr: '',
      currencyFrom,
      currencyTo: currencies[1] || currencyFrom,
    };
  }

  public componentDidMount(): void {
    this.fetchRatesAndSetTimeout();
  }

  public componentDidUpdate(
    prevProps: IExchangeWidgetContainerProps,
    prevState: IExchangeWidgetContainerState,
  ): void {
    const { currencyTo } = this.state;

    if (currencyTo !== prevState.currencyTo) {
      this.fetchRatesAndSetTimeout();
    }
  }

  public render() {
    const { backgroundColor, balances, className, currencies, rates } = this.props;
    const { amountFromStr, amountToStr, currencyFrom, currencyTo } = this.state;

    const currencyToData = rates[currencyTo];

    return (
      <ExchangeWidget
        backgroundColor={backgroundColor}
        className={className}
        amountFromStr={amountFromStr}
        amountToStr={amountToStr}
        balanceFrom={balances[currencyFrom] || 0}
        balanceTo={balances[currencyTo] || 0}
        currencies={currencies}
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
        isRateFetching={!!currencyToData && currencyToData.isFetching}
        rateTo={this.getRateTo(currencyFrom, currencyTo)}
        onAmountFromChange={this.onAmountFromChange}
        onAmountToChange={this.onAmountToChange}
        onCurrencyFromChange={this.onCurrencyFromChange}
        onCurrencyToChange={this.onCurrencyToChange}
        onExchange={this.onExchangeClick}
      />
    );
  }

  public componentWillUnmount(): void {
    this.clearTimeout();
  }

  private onAmountFromChange = (amountFromStr: string): void => {
    const { currencyFrom, currencyTo } = this.state;

    this.setState({
      amountFromStr,
      amountToStr: this.getAmountToStr(currencyFrom, amountFromStr, currencyTo),
    });
  };

  private onAmountToChange = (amountToStr: string): void => {
    const { currencyFrom, currencyTo } = this.state;

    this.setState({
      amountFromStr: this.getAmountToStr(currencyTo, amountToStr, currencyFrom),
      amountToStr,
    });
  };

  private onCurrencyFromChange = (currency: Currency): void => {
    const { amountFromStr, currencyTo } = this.state;

    this.setState({
      amountToStr: this.getAmountToStr(currency, amountFromStr, currencyTo),
      currencyFrom: currency,
    });
  };

  private onCurrencyToChange = (currency: Currency): void => {
    const { amountFromStr, currencyFrom } = this.state;

    this.setState({
      amountToStr: this.getAmountToStr(currencyFrom, amountFromStr, currency),
      currencyTo: currency,
    });
  };

  private onExchangeClick = (): void => {
    const { onExchange } = this.props;
    const { amountFromStr, currencyFrom, currencyTo } = this.state;
    const amountFrom = parseFloat(amountFromStr);

    if (isNaN(amountFrom)) {
      return;
    }

    onExchange(currencyFrom, amountFrom, currencyTo);

    this.setState({
      amountFromStr: '',
      amountToStr: '',
    });
  };

  private getRateTo(currencyFrom: Currency, currencyTo: Currency): number | undefined {
    const { rates } = this.props;

    const currencyToData = rates[currencyTo];

    return (currencyToData && currencyToData.isLoaded && currencyToData.rates[currencyFrom])
      || undefined;
  }

  private getAmountToStr(currencyFrom: Currency, amountFromStr: string, currencyTo: Currency): string {
    let amountToStr = '';
    if (isCashStringValid(amountFromStr)) {
      const amountFrom = parseFloat(amountFromStr);

      if (!isNaN(amountFrom)) {
        const rate = this.getRateTo(currencyFrom, currencyTo);

        if (rate) {
          amountToStr = cashFormat(amountFrom / rate);
        }
      }
    }

    return amountToStr;
  }

  private fetchRatesAndSetTimeout(): void {
    const { fetchRatesForCurrency: fetchRatesForCurrencyProp } = this.props;
    const { currencyTo } = this.state;

    this.clearTimeout();

    fetchRatesForCurrencyProp(currencyTo);
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

type MapStateFunc = (state: IRootState, ownProps: IExchangeWidgetContainerOwnProps) =>
  IExchangeWidgetContainerStateProps;
const mapState: MapStateFunc = (state) => ({
  rates: state.rates,
});

type MapDispatchFunc = (dispatch: Dispatch, ownProps: IExchangeWidgetContainerOwnProps) =>
  IExchangeWidgetContainerDispatchProps;
const mapDispatch: MapDispatchFunc = (dispatch) => bindActionCreators({
  fetchRatesForCurrency,
}, dispatch);

export default connect(mapState, mapDispatch)(ExchangeWidgetContainer);
