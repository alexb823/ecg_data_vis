import { combineReducers } from 'redux';

import { allDevices } from './devicesReducer';
import { allDaysFolders } from './daysFoldersReducer';
import { dataFilesFolders } from './dataFilesReducer';
import { ecgData } from './ecgDataReducer';
import { rhythm } from './rhythmDataReducer';

const RootReducer = combineReducers({
  allDevices,
  allDaysFolders,
  dataFilesFolders,
  ecgData,
  rhythm,
});

export default RootReducer;
