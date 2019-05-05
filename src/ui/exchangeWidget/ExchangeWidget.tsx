import { Button } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../constants/currencies';
import CurrencySlider from './currencySlider/CurrencySlider';
import { IBalancesData } from './dataTypes';

import styles from './ExchangeWidget.module.css';

interface IExchangeWidgetOwnProps {
  backgroundColor: string;
  className?: string;
  balances: IBalancesData;
  currencies: Currency[];

  onExchange(
    currencyFrom: Currency,
    amountFrom: number,
    currencyTo: Currency,
    amountTo: number,
  ): void;
}
const ExchangeWidget: React.FC<IExchangeWidgetOwnProps> = ({
  backgroundColor,
  balances,
  className,
  currencies,
}) => (
  <div className={classNames(styles.wrap, className)} style={{ backgroundColor }}>
    <CurrencySlider
      className={styles.row}
      currencies={currencies}
      initialCurrency={Currency.USD}
      isRateDisabled={true}
      isTriangleShown={true}
      triangleBackgroundColor={backgroundColor}
      balances={balances}
    />
    <CurrencySlider
      className={styles.row}
      currencies={currencies}
      initialCurrency={Currency.EUR}
      balances={balances}
    />
    <div className={styles.button_row}>
      <Button variant="contained" color="primary" size="large">
        Exchange
      </Button>
    </div>
  </div>
);
export default ExchangeWidget;
