import { applyMiddleware, compose, createStore as createReduxStore, Middleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers/rootReducer';
import { IAppState } from './reducers/rootState';

export default function createStore(initialState: Partial<IAppState>) {
  const composeEnhancers = (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const middlewares: Middleware[] = [];
  middlewares.push(thunk);

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
