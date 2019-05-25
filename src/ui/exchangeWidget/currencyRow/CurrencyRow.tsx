import {
  CircularProgress,
  createStyles,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Theme,
  Typography,
  WithStyles,
  withStyles,
} from '@material-ui/core';
import { TextFieldProps } from '@material-ui/core/TextField';
import classNames from 'classnames';
import React from 'react';
import { Currency, SymbolByCurrency } from '../../../constants/currencies';
import { KeyCode } from '../../../constants/keyCodes';
import { cashFormat } from '../../../utils/cashFormat';
import CashInput from './CashInput';

import styles from './CurrencyRow.module.css';

interface ICurrencyRowProps {
  className?: string;
  amountStr: string;
  balance: number;
  currencies: Currency[];
  currency: Currency;
  sourceCurrency: Currency;
  isBalanceError?: boolean;
  isRateFetching?: boolean;
  isSourceCurrency?: boolean;
  rate?: number;
  onAmountChange(amount: string): void;
  onCurrencyChange(currency: Currency): void;
  onInputEnterPress?(): void;
}

const CurrencyRow: React.FC<ICurrencyRowProps> = ({
  className,
  amountStr,
  balance,
  currencies,
  currency,
  sourceCurrency,
  isBalanceError,
  isRateFetching,
  isSourceCurrency,
  rate,
  onAmountChange,
  onCurrencyChange,
  onInputEnterPress,
}) => {
  const onCurrencySelectChange = React.useCallback(
    (event: React.ChangeEvent<HTMLSelectElement>) => onCurrencyChange(event.target.value as Currency),
    [onCurrencyChange],
  );
  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => onAmountChange(event.target.value),
    [onAmountChange],
  );
  const onInputKeyPress = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (onInputEnterPress && event.which === KeyCode.ENTER) {
        onInputEnterPress();
      }
    },
    [onInputEnterPress],
  );

  const selectItemsHtml = currencies.map((cur) => (
    <MenuItem key={cur} value={cur}>{cur}</MenuItem>
  ));

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
          error={isBalanceError}
          value={amountStr}
          InputProps={{inputProps: {className: styles.input}}}
          onChange={onInputChange}
          onKeyPress={onInputKeyPress}
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
        <FormControl>
          <InputLabel>{isSourceCurrency ? 'From' : 'To'}</InputLabel>
          <Select value={currency} onChange={onCurrencySelectChange}>
            {selectItemsHtml}
          </Select>
        </FormControl>
        <Typography variant="body2" className={styles.note} color={isBalanceError ? 'error' : undefined}>
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
  ({classes, ...restProps}) => {
    const inputProps = {
      ...restProps.InputProps,
      classes: {
        root: classes.input,
      },
    };

    return (
      <CashInput {...restProps} InputProps={inputProps}/>
    );
  };
const StyledTextField = withStyles(textFieldStyles)(StyledTextFieldComponent);
