import {
  createGenerateClassName,
  CssBaseline,
  jssPreset,
  MuiThemeProvider,
} from '@material-ui/core';
import { create } from 'jss';
import React from 'react';
import { JssProvider } from 'react-jss';
import { Provider } from 'react-redux';
import { Currency } from './constants/currencies';
import createStore from './data/store';
import App from './ui/App';
import muiTheme from './ui/muiTheme';

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: document.getElementById('jss-insertion-point')!,
});

const store = createStore({
  balances: {
    [Currency.USD]: 150,
    [Currency.EUR]: 100,
    [Currency.GBP]: 50,
  },
});

const Root: React.FC = () => (
  <JssProvider jss={jss} generateClassName={generateClassName}>
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline/>
      <Provider store={store}>
        <App/>
      </Provider>
    </MuiThemeProvider>
  </JssProvider>
);
export default Root;
