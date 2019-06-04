import { combineReducers } from 'redux';

import { allDevices } from './devicesReducer';
import { allDaysFolders } from './daysFoldersReducer';
import { dataFilesFolders } from './dataFilesReducer';
import { ecgData } from './ecgDataReducer';
import { rhythm } from './rhythmDataReducer';
import {highlightedEvent} from './highlightedEventReducer'

const rootReducer = combineReducers({
  allDevices,
  allDaysFolders,
  dataFilesFolders,
  ecgData,
  rhythm,
  highlightedEvent,
});

export default rootReducer;
