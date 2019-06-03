import React from 'react';
import { Currency } from '../../constants/currencies';
import { getBalanceForCurrency } from '../../data/reducers/balanceHelpers';
import { IBalancesState, IRatesState } from '../../data/reducers/rootState';
import { cashFormat } from '../../utils/cashFormat';
import { isCashStringValid } from '../../utils/isCashStringValid';
import ExchangeWidget from './ExchangeWidget';
import { parseCash } from "../../utils/parseCash";

const DEFAULT_UPDATE_RATES_INTERVAL = 10000;

export interface IExchangeWidgetControllerProps {
  backgroundColor: string;
  className?: string;
  balances: IBalancesState;
  currencies: Currency[];
  fetchTimeout?: number;
  rates: IRatesState;
  onExchange(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
  fetchRatesForCurrency(currency: Currency): void;
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
    const { currencyTo } = this.state;

    if (currencyTo !== prevState.currencyTo) {
      this.fetchRatesAndSetTimeout();
    }

    if (rates !== prevProps.rates) {
      this.onRatesChange();
    }
  }

  public render() {
    const { backgroundColor, balances, className, currencies, rates } = this.props;
    const { amountFromStr, amountToStr, currencyFrom, currencyTo } = this.state;

    const amountFrom = parseCash(amountFromStr);
    const balanceFrom = getBalanceForCurrency(balances, currencyFrom);
    const currencyToData = rates[currencyTo];

    const isSourceBalanceError = !isNaN(amountFrom) && balanceFrom < amountFrom;
    const isExchangeButtonDisabled =
      isNaN(amountFrom) || isSourceBalanceError || !this.getRateTo(currencyFrom, currencyTo);

    return (
      <ExchangeWidget
        backgroundColor={backgroundColor}
        className={className}
        amountFromStr={amountFromStr}
        amountToStr={amountToStr}
        balanceFrom={balanceFrom}
        balanceTo={getBalanceForCurrency(balances, currencyTo)}
        currencies={currencies}
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
        isExchangeButtonDisabled={isExchangeButtonDisabled}
        isRateFetching={!!currencyToData && currencyToData.isFetching}
        isSourceBalanceError={isSourceBalanceError}
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
    const amountFrom = parseCash(amountFromStr);

    if (isNaN(amountFrom)) {
      return;
    }

    onExchange(currencyFrom, amountFrom, currencyTo);

    this.setState({
      amountFromStr: '',
      amountToStr: '',
    });
  };

  private onRatesChange(): void {
    this.onAmountFromChange(this.state.amountFromStr);
  }

  private getRateTo(currencyFrom: Currency, currencyTo: Currency): number | undefined {
    const { rates } = this.props;

    const currencyToData = rates[currencyTo];

    return (currencyToData && currencyToData.isLoaded && currencyToData.rates[currencyFrom])
      || undefined;
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
        const rate = this.getRateTo(currencyFrom, currencyTo);

        if (rate) {
          const amountTo = isInversed ? amountFrom * rate : amountFrom / rate;
          amountToStr = cashFormat(amountTo);
        }
      }
    }

    return amountToStr;
  }

  private fetchRatesAndSetTimeout(): void {
    const { fetchTimeout, fetchRatesForCurrency: fetchRatesForCurrencyProp } = this.props;
    const { currencyTo } = this.state;

    this.clearTimeout();

    fetchRatesForCurrencyProp(currencyTo);
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
