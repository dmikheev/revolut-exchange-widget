import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { Currency } from '../constants/currencies';
import { IBalancesState } from '../data/reducers/rootState';
import ExchangeWidgetContainer from './exchangeWidget/ExchangeWidgetContainer';

import styles from './App.module.css';

interface IAppProps {
  balances: IBalancesState;
  exchangeCurrency(currencyFrom: Currency, amountFrom: number, currencyTo: Currency): void;
}
const App: React.FC<IAppProps> = ({ balances, exchangeCurrency: exchangeCurrencyProp }) => (
  <div className={styles.app}>
    <Typography variant="h4" gutterBottom={true}>
      Exchange widget demo
    </Typography>
    <Paper className={styles.widget_wrap}>
      <ExchangeWidgetContainer
        backgroundColor="#fafafa"
        className={styles.widget}
        currencies={Object.values(Currency)}
        balances={balances}
        onExchange={exchangeCurrencyProp}
      />
    </Paper>
  </div>
);
export default App;
