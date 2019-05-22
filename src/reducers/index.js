import { combineReducers } from 'redux';
import { devicesReducer } from './devicesReducer';
import { daysFoldersReducer } from './daysFoldersReducer';
import { dataFilesReducer } from './dataFilesReducer';

const RootReducer = combineReducers({
  allDevices: devicesReducer,
  allDaysFolders: daysFoldersReducer,
  dataFilesFolders: dataFilesReducer,
});


export default RootReducer;
