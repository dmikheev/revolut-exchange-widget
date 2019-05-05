import {
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

import styles from './CurrencyRow.module.css';

export interface ICurrencyRowProps {
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
        <Typography variant="body2" className={styles.note}>
          You have {balance} {currency}
        </Typography>
      </div>
      <div className={styles.column}>
        <StyledTextField/>
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
      classes: {
        root: classes.input,
      },
    };

    return (
      <TextField {...restProps} InputProps={inputProps}/>
    );
  };
const StyledTextField = withStyles(textFieldStyles)(StyledTextFieldComponent);
