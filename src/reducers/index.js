import { combineReducers } from 'redux';

import { allDevices } from './devicesReducer';
import { allDaysFolders } from './daysFoldersReducer';
import { dataFilesFolders } from './dataFilesReducer';
import { ecgData } from './ecgDataReducer';

const RootReducer = combineReducers({
  allDevices,
  allDaysFolders,
  dataFilesFolders,
  ecgData,
});

export default RootReducer;
