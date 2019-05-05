import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../../constants/currencies';
import { IBalancesData } from '../dataTypes';
import CurrencyRowContainer from './currencyRow/CurrencyRowContainer';

import styles from './CurrencySlider.module.css';

interface ICurrencySliderProps {
  className?: string;
  balances: IBalancesData;
  currencies: Currency[];
  currentCurrency: Currency;
  sourceCurrency: Currency;
  isSourceCurrency?: boolean;
  isTriangleShown?: boolean;
  triangleBackgroundColor?: string;
}
const CurrencySlider: React.FC<ICurrencySliderProps> = ({
  balances,
  className,
  currencies,
  currentCurrency,
  sourceCurrency,
  isSourceCurrency,
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

  const balance = balances[currentCurrency] || 0;

  const triangleHtml = isTriangleShown && (
    <div className={styles.triangle} style={{ borderTopColor: triangleBackgroundColor }}/>
  );

  return (
    <div className={wrapClassName}>
      <CurrencyRowContainer
        className={styles.row}
        currency={currentCurrency}
        sourceCurrency={sourceCurrency}
        balance={balance}
        isSourceCurrency={isSourceCurrency}
      />
      {triangleHtml}
    </div>
  );
};
export default CurrencySlider;
