import { combineReducers } from 'redux';
import { devicesReducer } from './devicesReducer';

const RootReducer = combineReducers({
  allDevices: devicesReducer,
});


export default RootReducer;
