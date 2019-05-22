import axios from 'axios';
import { baseUrl, parseListOfLinks, parseModifiedDates } from './utils';

const GOT_ALL_DAYS_FOLDERS = 'GOT_ALL_DAYS_FOLDERS';

const gotAllDaysFolders = daysFolders => {
  return {
    type: GOT_ALL_DAYS_FOLDERS,
    daysFolders,
  };
};

export const daysFoldersReducer = (state = [], action) => {
  switch (action.type) {
    case GOT_ALL_DAYS_FOLDERS:
      return action.daysFolders;
    default:
      return state;
  }
};

// Thunks

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
    return Promise.all([
      fetchFolderNames(deviceId),
      fetchModifiedDates(deviceId),
    ])
      .then(([folderNamesArr, dateModArr]) =>
        folderNamesArr.map((folderName, index) => {
          return { link: folderName, modDate: dateModArr[index], id: `${deviceId}_${folderName}` };
        })
      )
      .then(daysFolders => dispatch(gotAllDaysFolders(daysFolders)));
  };
};
