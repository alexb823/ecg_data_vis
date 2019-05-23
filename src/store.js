import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import loggerMiddleware from 'redux-logger';
import RootReducer from './reducers';

const store = createStore(
  RootReducer,
  applyMiddleware(thunkMiddleware)
);

export default store;
