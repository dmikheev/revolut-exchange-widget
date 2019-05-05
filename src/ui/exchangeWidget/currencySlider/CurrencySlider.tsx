import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../../constants/currencies';
import CurrencyRow from './currencyRow/CurrencyRow';
import { IBalancesData } from '../dataTypes';

import styles from './CurrencySlider.module.css';

interface ICurrencySliderProps {
  className?: string;
  balances: IBalancesData;
  currencies: Currency[];
  initialCurrency?: Currency;
  isRateDisabled?: boolean;
  isTriangleShown?: boolean;
  triangleBackgroundColor?: string;
}
const CurrencySlider: React.FC<ICurrencySliderProps> = ({
  balances,
  className,
  currencies,
  initialCurrency: initialCurrencyProp,
  isTriangleShown,
  triangleBackgroundColor,
}) => {
  if (currencies.length < 1) {
    throw new Error(`Empty currencies list is not allowed in CurrencySlider!`);
  }

  const wrapClassName = classNames(
    styles.wrap,
    isTriangleShown && styles.wrap__with_triangle,
    className,
  );

  const currency = (initialCurrencyProp && currencies.indexOf(initialCurrencyProp) !== -1)
    ? initialCurrencyProp
    : currencies[0];
  const balance = balances[currency] || 0;

  const triangleHtml = isTriangleShown && (
    <div className={styles.triangle} style={{ borderTopColor: triangleBackgroundColor }}/>
  );

  return (
    <div className={wrapClassName}>
      <CurrencyRow className={styles.row} currency={currency} balance={balance}/>
      {triangleHtml}
    </div>
  );
};
export default CurrencySlider;
