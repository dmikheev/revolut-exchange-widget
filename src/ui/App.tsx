import { Paper, Typography } from '@material-ui/core';
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { Currency } from '../constants/currencies';
import { exchangeCurrency } from '../data/actions/balanceActions';
import { IBalancesState, IRootState } from '../data/reducers/rootState';
import ExchangeWidget from './exchangeWidget/ExchangeWidget';

import styles from './App.module.css';

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
  <div className={styles.app}>
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
