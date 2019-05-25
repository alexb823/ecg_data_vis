import axios from 'axios';
import { baseUrl, parseListOfLinks, parseModifiedDates } from './utils';

// // Action types
const DAYS_FOLDERS_REQUEST = 'DAYS_FOLDERS_REQUEST';
const DAYS_FOLDERS_FAILURE = 'DAYS_FOLDERS_FAILURE';
const GOT_ALL_DAYS_FOLDERS = 'GOT_ALL_DAYS_FOLDERS';

// // Action creators
const daysFoldersRequest = () => {
  return {
    type: DAYS_FOLDERS_REQUEST,
  };
};

const daysFoldersFailure = error => {
  return {
    type: DAYS_FOLDERS_FAILURE,
    error,
  };
};

const gotAllDaysFolders = daysFolderList => {
  return {
    type: GOT_ALL_DAYS_FOLDERS,
    daysFolderList,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', daysFolderList: [] };

// // Reducer
export const allDaysFolders = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DAYS_FOLDERS_REQUEST:
      return { status: 'fetching', daysFolderList: [] };
    case DAYS_FOLDERS_FAILURE:
      return { status: 'failed', daysFolderList: action.error };
    case GOT_ALL_DAYS_FOLDERS:
      return { status: 'fetched', daysFolderList: action.daysFolderList };
    default:
      return state;
  }
};

// // Thunks

// helper
// Fetch the folder modified GMT dates for the device at /wxapp2/ecgdata/liveecg/:deviceId
// and parse the mod date as we filter for only unique date values
const fetchModifiedDates = deviceId => {
  return axios
    .get(`${baseUrl}/${deviceId}`)
    .then(response => parseModifiedDates(response.data))
    .then(dates => dates.reverse());
};

// helper
// Fetch the list folder names (which is an 8 digit date strings)
// for the device at /wxapp2/ecgdata/liveecg/:deviceId
// and parse the list of links
const fetchFolderNames = deviceId => {
  return axios
    .get(`${baseUrl}/${deviceId}`)
    .then(response => parseListOfLinks(response.data))
    .then(dates => dates.reverse());
};

// Put it all together
// Make an array of objects for creating a list of days links
// Will have folder name to append to the baseUrl, and date modified for the link text
export const fetchAllDaysFolders = deviceId => {
  return dispatch => {
    dispatch(daysFoldersRequest());

    return Promise.all([
      fetchFolderNames(deviceId),
      fetchModifiedDates(deviceId),
    ])
      .then(([folderNamesArr, dateModArr]) =>
        folderNamesArr.map((folderName, index) => {
          return {
            link: folderName,
            modDate: dateModArr[index],
            id: `${deviceId}_${folderName}`,
          };
        })
      )
      .then(daysFolders => dispatch(gotAllDaysFolders(daysFolders)))
      .catch(error => dispatch(daysFoldersFailure(error)));
  };
};
