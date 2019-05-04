import { applyMiddleware, compose, createStore as createReduxStore, Middleware } from 'redux';
import rootReducer from './reducers/rootReducer';
import { IRootState } from './reducers/rootState';

export default function createStore(initialState: Partial<IRootState>) {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares: Middleware[] = [];
  if (process.env.NODE_ENV === 'development') {
    const createLogger = require('redux-logger').createLogger;

    middlewares.push(createLogger({
      duration: true,
    }));
  }

  return createReduxStore(
    rootReducer,
    initialState,
    composeEnhancers(applyMiddleware(...middlewares)),
  );
}
