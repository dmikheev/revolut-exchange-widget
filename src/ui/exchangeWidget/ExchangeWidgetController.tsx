import React from 'react';
import { Currency, getCurrencyPair } from '../../constants/currencies';
import { getBalanceForCurrency } from '../../data/reducers/balanceHelpers';
import { IBalancesState, IRatesState } from '../../data/reducers/rootState';
import { cashFormat } from '../../utils/cashFormat';
import { isCashStringValid } from '../../utils/isCashStringValid';
import ExchangeWidget from './ExchangeWidget';
import { parseCash } from '../../utils/parseCash';

const DEFAULT_UPDATE_RATES_INTERVAL = 10000;

export interface IExchangeWidgetControllerProps {
  backgroundColor: string;
  className?: string;
  balances: IBalancesState;
  currencies: Currency[];
  fetchTimeout?: number;
  rates: IRatesState;
  onExchange(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
  fetchRates(cur1: Currency, cur2: Currency): void;
}
interface IDefaultProps {
  fetchTimeout: number;
}
type IProps = IExchangeWidgetControllerProps & IDefaultProps;

interface IExchangeWidgetControllerState {
  amountFromStr: string;
  amountToStr: string;
  currencyFrom: Currency;
  currencyTo: Currency;
}

class ExchangeWidgetController extends React.PureComponent<IProps, IExchangeWidgetControllerState> {
  private updateRatesTimeoutId: number | null = null;

  constructor(props: IProps) {
    super(props);

    const { currencies } = props;
    if (currencies.length === 0) {
      throw new Error('Currency list must not be empty in ExchangeWidgetController!');
    }

    const currencyFrom = currencies[0];

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
    prevProps: IExchangeWidgetControllerProps,
    prevState: IExchangeWidgetControllerState,
  ): void {
    const { rates } = this.props;
    const { currencyFrom, currencyTo } = this.state;

    if (currencyFrom !== prevState.currencyFrom || currencyTo !== prevState.currencyTo) {
      this.fetchRatesAndSetTimeout();
    }

    if (rates !== prevProps.rates) {
      this.onRatesChange();
    }
  }

  public render() {
    const { backgroundColor, balances, className, currencies, rates } = this.props;
    const { amountFromStr, amountToStr, currencyFrom, currencyTo } = this.state;

    const ratesData = rates[getCurrencyPair(currencyFrom, currencyTo)];

    return (
      <ExchangeWidget
        backgroundColor={backgroundColor}
        className={className}
        amountFromStr={amountFromStr}
        amountToStr={amountToStr}
        balanceFrom={getBalanceForCurrency(balances, currencyFrom)}
        balanceTo={getBalanceForCurrency(balances, currencyTo)}
        currencies={currencies}
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
        isExchangeDisabled={this.isExchangeDisabled()}
        isRateFetching={!!ratesData && ratesData.isFetching}
        isSourceBalanceError={this.isSourceBalanceError()}
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
      amountFromStr: this.getAmountToStr(currencyFrom, amountToStr, currencyTo, true),
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

    if (this.isExchangeDisabled()) {
      return;
    }

    const amountFrom = parseCash(amountFromStr);

    onExchange(currencyFrom, amountFrom, currencyTo);

    this.setState({
      amountFromStr: '',
      amountToStr: '',
    });
  };

  private onRatesChange(): void {
    this.onAmountFromChange(this.state.amountFromStr);
  }

  private getRateFrom(currencyFrom: Currency, currencyTo: Currency): number | undefined {
    const { rates } = this.props;
    const ratesData = rates[getCurrencyPair(currencyFrom, currencyTo)];

    return (ratesData && ratesData.isLoaded && ratesData.data[currencyFrom]) || undefined;
  }

  private getRateTo(currencyFrom: Currency, currencyTo: Currency): number | undefined {
    const rateFrom = this.getRateFrom(currencyFrom, currencyTo);

    return rateFrom ? 1 / rateFrom : undefined;
  }

  private getAmountToStr(
    currencyFrom: Currency,
    amountFromStr: string,
    currencyTo: Currency,
    isInversed?: boolean,
  ): string {
    let amountToStr = '';
    if (isCashStringValid(amountFromStr)) {
      const amountFrom = parseCash(amountFromStr);

      if (!isNaN(amountFrom)) {
        const rate = this.getRateFrom(currencyFrom, currencyTo);

        if (rate) {
          const amountTo = isInversed ? amountFrom / rate : amountFrom * rate;
          amountToStr = cashFormat(amountTo);
        }
      }
    }

    return amountToStr;
  }

  private isExchangeDisabled(): boolean {
    const { amountFromStr, currencyFrom, currencyTo } = this.state;
    const amountFrom = parseCash(amountFromStr);

    return isNaN(amountFrom) || this.isSourceBalanceError() || !this.getRateFrom(currencyFrom, currencyTo);
  }

  private isSourceBalanceError(): boolean {
    const { balances } = this.props;
    const { amountFromStr, currencyFrom } = this.state;

    const amountFrom = parseCash(amountFromStr);
    const balanceFrom = getBalanceForCurrency(balances, currencyFrom);

    return !isNaN(amountFrom) && balanceFrom < amountFrom;
  }

  private fetchRatesAndSetTimeout(): void {
    const { fetchTimeout, fetchRates } = this.props;
    const { currencyFrom, currencyTo } = this.state;

    this.clearTimeout();

    fetchRates(currencyFrom, currencyTo);
    // TS берёт тип из NodeJS.setTimeout, который возвращает Timeout вместо number,
    // поэтому приведём вручную к number
    this.updateRatesTimeoutId = setTimeout(() => {
      this.fetchRatesAndSetTimeout();
    }, fetchTimeout) as unknown as number;
  }

  private clearTimeout(): void {
    if (this.updateRatesTimeoutId !== null) {
      clearTimeout(this.updateRatesTimeoutId);
    }
  }
}

const ComponentWithDefaults =
  ExchangeWidgetController as React.ComponentClass<IExchangeWidgetControllerProps, IExchangeWidgetControllerState>;
ComponentWithDefaults.defaultProps = {
  fetchTimeout: DEFAULT_UPDATE_RATES_INTERVAL,
};

export default ComponentWithDefaults;
