import { Typography } from '@material-ui/core';
import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../../../constants/currencies';

import styles from './CurrencyRow.module.css';

interface ICurrencyRowProps {
  className?: string;
  balance: number;
  currency: Currency;
  isRateDisabled?: boolean;
}
const CurrencyRow: React.FC<ICurrencyRowProps> = ({
  className,
  balance,
  currency,
}) => {
  return (
    <div className={classNames(styles.wrap, className)}>
      <div className={styles.column}>
        <Typography variant="h3">
          {currency}
        </Typography>
        <Typography variant="body2" className={styles.balance}>
          You have {balance} {currency}
        </Typography>
      </div>
      <div className={styles.column}>

      </div>
    </div>
  );
};
export default CurrencyRow;
