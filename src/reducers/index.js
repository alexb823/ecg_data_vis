import { combineReducers } from 'redux';
import { devicesReducer } from './devicesReducer';
import { daysFoldersReducer } from './daysFoldersReducer';

const RootReducer = combineReducers({
  allDevices: devicesReducer,
  allDaysFolders: daysFoldersReducer,
});


export default RootReducer;
