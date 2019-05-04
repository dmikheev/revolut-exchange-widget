import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Currency } from './constants/currencies';
import createStore from './data/store';
import './index.css';
import App from './ui/App';

const store = createStore({
  balances: {
    [Currency.USD]: 150,
    [Currency.EUR]: 100,
    [Currency.GBP]: 50,
  },
});

ReactDOM.render((
  <Provider store={store}>
    <App/>
  </Provider>
), document.getElementById('root'));
