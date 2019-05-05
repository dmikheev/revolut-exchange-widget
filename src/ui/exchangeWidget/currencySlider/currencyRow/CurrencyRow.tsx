import {
  CircularProgress,
  createStyles,
  TextField,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import classNames from 'classnames';
import React from 'react';
import { Currency } from '../../../../constants/currencies';
import { ICurrencyData } from '../../../../data/reducers/rootState';

import styles from './CurrencyRow.module.css';

interface ICurrencyRowProps {
  className?: string;
  balance: number;
  currency: Currency;
  currencyData?: ICurrencyData;
  isSourceCurrency?: boolean;
  sourceCurrency: Currency;
}
const CurrencyRow: React.FC<ICurrencyRowProps> = ({
  className,
  balance,
  currency,
  currencyData,
  isSourceCurrency,
  sourceCurrency,
}) => {
  let amountColumnHtml;
  if (isSourceCurrency || currency !== sourceCurrency) {
    let rateContentHtml;
    if (!isSourceCurrency && currencyData) {
      const rateValueHtml = currencyData.isLoaded && (
        <Typography variant="body2" className={styles.note}>
          1 {currency} = {currencyData.rates[sourceCurrency]} {sourceCurrency}
        </Typography>
      );
      const rateProgressHtml = currencyData.isFetching && (
        <CircularProgress className={styles.rate_progress} size="0.8em" color="secondary"/>
      );

      rateContentHtml = (
        <React.Fragment>
          {rateValueHtml}
          {rateProgressHtml}
        </React.Fragment>
      );
    }

    amountColumnHtml = (
      <React.Fragment>
        <StyledTextField InputProps={{ inputProps: { className: styles.input }}}/>
        <div className={styles.rate_wrap}>
          {rateContentHtml}
        </div>
      </React.Fragment>
    );
  }

  return (
    <div className={classNames(styles.wrap, className)}>
      <div className={styles.column}>
        <Typography variant="h3">
          {currency}
        </Typography>
        <Typography variant="body2" className={styles.note}>
          You have {balance} {currency}
        </Typography>
      </div>
      <div className={styles.column}>
        {amountColumnHtml}
      </div>
    </div>
  );
};
export default CurrencyRow;

const textFieldStyles = (theme: Theme) => createStyles({
  input: theme.typography.h3,
});

type IStyledTextFieldComponentProps = TextFieldProps & WithStyles<typeof textFieldStyles>;
const StyledTextFieldComponent: React.FC<IStyledTextFieldComponentProps> =
  ({ classes, ...restProps }) => {
    const inputProps = {
      ...restProps.InputProps,
      classes: {
        root: classes.input,
      },
    };

    return (
      <TextField {...restProps} InputProps={inputProps}/>
    );
  };
const StyledTextField = withStyles(textFieldStyles)(StyledTextFieldComponent);
