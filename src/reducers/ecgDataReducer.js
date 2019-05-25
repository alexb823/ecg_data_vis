import axios from 'axios';
import { baseUrl, parseSmoothECG } from './utils';

// // Action types
const ECG_DATA_REQUEST = 'ECG_DATA_REQUEST';
const ECG_DATA_FAILURE = 'ECG_DATA_FAILURE';
const GOT_ECG_DATA = 'GOT_ECG_DATA';

// // Action creators
const ecgDataRequest = () => {
  return {
    type: ECG_DATA_REQUEST,
  };
};

const ecgDataFailure = error => {
  return {
    type: ECG_DATA_FAILURE,
    error,
  };
};

const gotEcgData = ecgDataArr => {
  return {
    type: GOT_ECG_DATA,
    ecgDataArr,
  };
};

// // State
const INITIAL_STATE = { status: 'initial', ecgDataArr: [] };

// // Reducer
export const ecgData = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ECG_DATA_REQUEST:
      return { status: 'fetching', ecgDataArr: [] };
    case ECG_DATA_FAILURE:
      return { status: 'failed', ecgDataArr: '' };
    case GOT_ECG_DATA:
      return { status: 'fetched', ecgDataArr: action.ecgDataArr };
    default:
      return state;
  }
};

// // Thunks
// Get the ecg data txt file and parse the text
// Map the x & y data points
// Returns an array of objects with x and y values for the ecg graph
export const fetchEcg = (deviceId, dataFilesArr) => {
  let ecgFileRef = dataFilesArr.find(obj =>
    obj.name.endsWith('_smoothECG.txt')
  );
  let timeStamp = Date.parse(ecgFileRef.modDate);

  return dispatch => {
    dispatch(ecgDataRequest());

    return axios
      .get(`${baseUrl}/${deviceId}/${ecgFileRef.linkEx}/${ecgFileRef.name}`)
      .then(response => parseSmoothECG(response.data))
      .then(ecg =>
        ecg.map(microvolts => {
          const dataPoint = { x: timeStamp, y: microvolts };
          timeStamp += 4;
          return dataPoint;
        })
      )
      .then(ecgDataArr => dispatch(gotEcgData(ecgDataArr)))
      .catch(error => dispatch(ecgDataFailure(error)));
  };
};
