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
import { Currency, SymbolByCurrency } from '../../../../constants/currencies';
import { cashFormat } from '../../../../utils/cashFormat';

import styles from './CurrencyRow.module.css';

interface ICurrencyRowProps {
  className?: string;
  amountStr: string;
  balance: number;
  currency: Currency;
  sourceCurrency: Currency;
  isRateFetching: boolean;
  isSourceCurrency?: boolean;
  rate?: number;
  onAmountChange(amount: string): void;
}
const CurrencyRow: React.FC<ICurrencyRowProps> = ({
  className,
  amountStr,
  balance,
  currency,
  sourceCurrency,
  isRateFetching,
  isSourceCurrency,
  rate,
  onAmountChange,
}) => {
  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onAmountChange(event.target.value),
    [onAmountChange],
  );

  let amountColumnHtml;
  if (isSourceCurrency || currency !== sourceCurrency) {
    let rateContentHtml;
    if (!isSourceCurrency) {
      const rateValueHtml = rate !== undefined && (
        <Typography variant="body2" className={styles.note}>
          {SymbolByCurrency[currency]}1 = {SymbolByCurrency[sourceCurrency]}{cashFormat(rate)}
        </Typography>
      );
      const rateProgressHtml = isRateFetching && (
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
        <StyledTextField
          value={amountStr}
          InputProps={{ inputProps: { className: styles.input }}}
          onChange={onInputChange}
        />
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
          You have {SymbolByCurrency[currency]}{cashFormat(balance)}
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
