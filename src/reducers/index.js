import { combineReducers } from 'redux';
import { devicesReducer } from './devicesReducer';
import { daysFoldersReducer } from './daysFoldersReducer';
import { dataFilesReducer } from './dataFilesReducer';
import {ecgDataReducer} from './ecgDataReducer';

const RootReducer = combineReducers({
  allDevices: devicesReducer,
  allDaysFolders: daysFoldersReducer,
  dataFilesFolders: dataFilesReducer,
  ecgData: ecgDataReducer,
});


export default RootReducer;
