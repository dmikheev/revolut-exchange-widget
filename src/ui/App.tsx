import { CssBaseline, Paper, Typography } from '@material-ui/core';
import { createGenerateClassName, jssPreset, MuiThemeProvider } from '@material-ui/core/styles';
import { create } from 'jss';
import React from 'react';
import { JssProvider } from 'react-jss';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../constants/currencies';
import { exchangeCurrency } from '../data/actions/balanceActions';
import { IBalancesState, IRootState } from '../data/reducers/rootState';
import ExchangeWidget from './exchangeWidget/ExchangeWidget';
import muiTheme from './muiTheme';

import styles from './App.module.css';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point')!,
});

interface IAppStateProps {
  balances: IBalancesState;
}
interface IAppDispatchProps {
  exchangeCurrency(
    currencyFrom: Currency,
    amountFrom: number,
    currencyTo: Currency,
    amountTo: number,
  ): void;
}

type IAppProps = IAppStateProps & IAppDispatchProps;
const App: React.FC<IAppProps> = ({ balances, exchangeCurrency: exchangeCurrencyProp }) => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={muiTheme}>
      <div className={styles.app}>
        <CssBaseline/>
        <Typography variant="h4" gutterBottom={true}>
          Exchange widget demo
        </Typography>
        <Paper className={styles.widget_wrap}>
          <ExchangeWidget
            backgroundColor="#fafafa"
            className={styles.widget}
            currencies={Object.values(Currency)}
            balances={balances}
            onExchange={exchangeCurrencyProp}
          />
        </Paper>
      </div>
    </MuiThemeProvider>
  </JssProvider>
);

type MapStateFunc = (state: IRootState) => IAppStateProps;
const mapState: MapStateFunc = (state) => ({
  balances: state.balances,
});

type MapDispatchFunc = (dispatch: Dispatch) => IAppDispatchProps;
const mapDispatch: MapDispatchFunc = (dispatch) => bindActionCreators({
  exchangeCurrency,
}, dispatch);

export default connect(mapState, mapDispatch)(App);
