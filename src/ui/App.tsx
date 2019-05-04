import React from 'react';
import erApi from '../api/exchangeRatesApi';
import { Currency } from '../constants/currencies';
import styles from './App.module.css';

const App: React.FC = () => {
  React.useEffect(() => {
    erApi.get(Currency.USD).then((res) => console.log(res));
  }, []);

  return (
    <div className={styles.app}>
      <h1>Exchange widget demo</h1>
      <div className={styles.widget_wrap}>

      </div>
    </div>
  );
};

export default App;
