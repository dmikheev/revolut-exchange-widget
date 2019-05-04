import React from 'react';
import styles from './App.module.css';

const App: React.FC = () => {
  return (
    <div className={styles.app}>
      <h1>Exchange widget demo</h1>
      <div className={styles.widget_wrap}>

      </div>
    </div>
  );
};

export default App;
