import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../../constants/currencies';
import CurrencyRow from './currencyRow/CurrencyRow';

import styles from './CurrencySlider.module.css';

interface ICurrencySliderProps {
  className?: string;
  amountStr: string;
  balance: number;
  currencies: Currency[];
  currentCurrency: Currency;
  sourceCurrency: Currency;
  isRateFetching: boolean;
  isSourceCurrency?: boolean;
  rate?: number;
  triangleBackgroundColor?: string;
  onAmountChange(amount: string): void;
  onCurrencyChange(currency: Currency): void;
}
const CurrencySlider: React.FC<ICurrencySliderProps> = ({
  amountStr,
  balance,
  className,
  currencies,
  currentCurrency,
  sourceCurrency,
  isRateFetching,
  isSourceCurrency,
  rate,
  triangleBackgroundColor,
  onAmountChange,
}) => {
  if (currencies.length < 1) {
    throw new Error(`Empty currencies list is not allowed in CurrencySlider!`);
  }

  const wrapClassName = classNames(
    styles.wrap,
    isSourceCurrency && styles.wrap__with_triangle,
    className,
  );

  const triangleHtml = isSourceCurrency && (
    <div className={styles.triangle} style={{ borderTopColor: triangleBackgroundColor }}/>
  );

  return (
    <div className={wrapClassName}>
      <CurrencyRow
        className={styles.row}
        amountStr={amountStr}
        balance={balance}
        currency={currentCurrency}
        sourceCurrency={sourceCurrency}
        isRateFetching={isRateFetching}
        isSourceCurrency={isSourceCurrency}
        rate={rate}
        onAmountChange={onAmountChange}
      />
      {triangleHtml}
    </div>
  );
};
export default CurrencySlider;
