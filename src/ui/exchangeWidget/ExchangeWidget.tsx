import { Button } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../constants/currencies';
import CurrencyRow from './currencyRow/CurrencyRow';

import styles from './ExchangeWidget.module.css';

interface IExchangeWidgetProps {
  backgroundColor: string;
  className?: string;
  amountFromStr: string;
  amountToStr: string;
  balanceFrom: number;
  balanceTo: number;
  currencies: Currency[];
  currencyFrom: Currency;
  currencyTo: Currency;
  isExchangeDisabled: boolean;
  isRateFetching: boolean;
  isSourceBalanceError: boolean;
  rateTo?: number;

  onAmountFromChange(value: string): void;
  onAmountToChange(value: string): void;
  onCurrencyFromChange(currency: Currency): void;
  onCurrencyToChange(currency: Currency): void;
  onExchange(): void;
}
const ExchangeWidget: React.FC<IExchangeWidgetProps> = ({
  backgroundColor,
  className,
  amountFromStr,
  amountToStr,
  balanceFrom,
  balanceTo,
  currencies,
  currencyFrom,
  currencyTo,
  isExchangeDisabled,
  isRateFetching,
  isSourceBalanceError,
  rateTo,
  onAmountFromChange,
  onAmountToChange,
  onCurrencyFromChange,
  onCurrencyToChange,
  onExchange,
}) => (
  <div className={classNames(styles.wrap, className)} style={{ backgroundColor }}>
    <CurrencyRow
      className={styles.row}
      amountStr={amountFromStr}
      balance={balanceFrom}
      currencies={currencies}
      currency={currencyFrom}
      sourceCurrency={currencyFrom}
      isBalanceError={isSourceBalanceError}
      isSourceCurrency={true}
      onAmountChange={onAmountFromChange}
      onCurrencyChange={onCurrencyFromChange}
      onInputEnterPress={isExchangeDisabled ? undefined : onExchange}
    />
    <CurrencyRow
      className={styles.row}
      amountStr={amountToStr}
      balance={balanceTo}
      currencies={currencies}
      currency={currencyTo}
      sourceCurrency={currencyFrom}
      isRateFetching={isRateFetching}
      isSourceCurrency={false}
      rate={rateTo}
      onAmountChange={onAmountToChange}
      onCurrencyChange={onCurrencyToChange}
      onInputEnterPress={isExchangeDisabled ? undefined : onExchange}
    />
    <div className={styles.button_row}>
      <Button variant="contained" color="primary" disabled={isExchangeDisabled} size="large" onClick={onExchange}>
        Exchange
      </Button>
    </div>
  </div>
);
export default ExchangeWidget;
