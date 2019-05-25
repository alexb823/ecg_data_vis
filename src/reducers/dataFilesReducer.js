import axios from 'axios';
import { baseUrl, parseModifiedDates, parseListOfFiles } from './utils';

// // Action types
const DATA_FILE_FOLDER_REQUEST = 'DATA_FILE_FOLDER_REQUEST';
const DATA_FILE_FOLDER_FAILURE = 'DATA_FILE_FOLDER_FAILURE';
const GOT_ALL_FILE_FOLDERS = 'GOT_ALL_FILE_FOLDERS';

// // Action creators
const dataFileFolderRequest = () => {
  return {
    type: DATA_FILE_FOLDER_REQUEST,
  };
};

const dataFileFolderFailure = error => {
  return {
    type: DATA_FILE_FOLDER_FAILURE,
    error,
  };
};

const gotAllFileFolders = dataFileFolderList => {
  return {
    type: GOT_ALL_FILE_FOLDERS,
    dataFileFolderList,
  };
};

// // States
const INITIAL_STATE = { status: 'initial', dataFileFolderList: [] };

// // Reducer
export const dataFilesFolders = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case DATA_FILE_FOLDER_REQUEST:
      return { status: 'fetching', dataFileFolderList: [] };
    case DATA_FILE_FOLDER_FAILURE:
      return { status: 'failed', dataFileFolderList: action.error };
    case GOT_ALL_FILE_FOLDERS:
      return { status: 'fetched', dataFileFolderList: action.dataFileFolderList };
    default:
      return state;
  }
};

// // Thunks
// helper
// Fetch file modified GMT dates at /wxapp2/ecgdata/liveecg/:deviceId/:folderName
// and parse the mod date as we filter for only unique date values
const fetchModifiedDates = (deviceId, folderName) => {
  return axios
    .get(`${baseUrl}/${deviceId}/${folderName}`)
    .then(response => parseModifiedDates(response.data))
    .then(dates => dates.reverse());
};

// helper
// Fetch the data files for a date for the device
// at /wxapp2/ecgdata/liveecg/:deviceId/:folderName
// and parse the list of links
// Returns an array of file names in the day folder
const fetchDataFile = (deviceId, folderName) => {
  return axios
    .get(`${baseUrl}/${deviceId}/${folderName}`)
    .then(response => parseListOfFiles(response.data))
    .then(files => files.reverse());
};

// Put it all together
// Returns an array of arrays of data "folder" obj for creating a list of links for files
// Each obj will have day folderName (linkEx) & file name (name) both used to
// append to the base url baseUrl/:deviseId/:folderName/:fileName
// This combined url used to get the file, and date modified (date also needed for the graph)
// folder name is the 8 digit number with the year and date (ex: 20190519)
export const fetchFileNamesAndDates = (deviceId, folderName) => {
  return dispatch => {
    dispatch(dataFileFolderRequest());

    return Promise.all([
      fetchDataFile(deviceId, folderName),
      fetchModifiedDates(deviceId, folderName),
    ])
      .then(([filesArr, dateModArr]) =>
        filesArr.reduce((acc, fileName, index) => {
          const strArr = fileName.split('.').join('_').split('_');
          const filesKey = `${strArr[0]}_${strArr[1]}_${deviceId}`; //key is date_time_deviseId)
          const modDate = dateModArr[index];
          const utc = Date.parse(modDate);
          if (acc[filesKey]) {
            acc[filesKey].push({name: filesArr[index], modDate, utc, linkEx: strArr[0], filesKey});
          } else {
            acc[filesKey] = [{name: filesArr[index], modDate, utc, linkEx: strArr[0], filesKey}];
          }
          return acc;
        }, {})
      )
      .then(files => {
        return Object.keys(files).map(key => {
          return files[key]
        });
      })
      .then(dataFilesList => dispatch(gotAllFileFolders(dataFilesList)))
      .catch(error => dispatch(dataFileFolderFailure(error)))
  };
};
