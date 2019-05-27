import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import RootReducer from './reducers';

const store = createStore(
  RootReducer,
  composeWithDevTools(applyMiddleware(thunkMiddleware))
);

export default store;
